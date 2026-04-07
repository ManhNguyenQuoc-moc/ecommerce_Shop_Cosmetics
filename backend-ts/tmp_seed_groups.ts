import { prisma } from './src/config/prisma';

async function main() {
  const groups = await prisma.categoryGroup.findMany();
  const getGroupId = (name: string) => groups.find(g => g.name.includes(name))?.id;

  const categories = await prisma.category.findMany();
  for (const cat of categories) {
    let groupId: string | undefined | null = null;
    
    if (cat.name.includes('Trang điểm')) {
        groupId = getGroupId('Trang điểm');
    } else if (['Mặt nạ', 'Sữa rửa mặt', 'Tẩy trang', 'Chống nắng'].some(k => cat.name.includes(k))) {
        groupId = getGroupId('Chăm sóc da');
    } else if (cat.name.toLowerCase().includes('tóc')) {
        groupId = getGroupId('Chăm sóc tóc');
    } else if (['Sữa tắm', 'Dưỡng thể', 'răng miệng'].some(k => cat.name.includes(k))) {
        groupId = getGroupId('Chăm sóc cơ thể');
    } else if (cat.name.includes('Nước hoa')) {
        groupId = getGroupId('Nước hoa');
    }

    if (groupId) {
      await prisma.category.update({
        where: { id: cat.id },
        data: { categoryGroupId: groupId }
      });
      console.log(`Linked: ${cat.name} -> Group ID: ${groupId}`);
    } else {
      console.log(`Skipped (no group match): ${cat.name}`);
    }
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
