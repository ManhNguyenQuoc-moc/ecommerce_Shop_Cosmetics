const AppLoader = () => {
  return (
    <div className="app-loader bg-white/80 dark:bg-slate-950/80">
      <div className="loader-spin">
        <span className="crema-dot crema-dot-spin">
          <i></i><i></i><i></i><i></i><i></i>
        </span>
      </div>
    </div>
  );
};
export default AppLoader;