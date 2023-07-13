import classes from './Sidebar.module.css';
import Navbar from './Navbar';
import Search from './Search';
import Chats from './Chats';

const Sidebar = () => {
  return (
    <div className={classes.sidebar}>
      <Navbar />
      <Search />
      <Chats />
    </div>
  );
};
export default Sidebar;
