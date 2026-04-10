ALTER TABLE "User" ADD CONSTRAINT "User_googleId_key" UNIQUE ("googleId");
ALTER TABLE "User" ADD CONSTRAINT "User_facebookId_key" UNIQUE ("facebookId");
