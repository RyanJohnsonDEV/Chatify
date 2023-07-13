import classes from './Home.module.css';
import Sidebar from '../components/Chat/Sidebar';
import Chat from '../components/Chat/Chat';
import { useState } from 'react';

function Home() {
  const [sidebarToggled, setSidebarToggled] = useState(false);

  function toggleSidebar() {
    setSidebarToggled((prev) => !prev);
  }

  return (
    <div className={classes.home}>
      <div className={classes.container}>
        <div
          className={`${classes['sidebar-container']} ${
            sidebarToggled && classes['toggledOn']
          }`}
        >
          <Sidebar className={classes.sidebar} />
          <div
            className={classes['show-hide-sidebar-button']}
            onClick={toggleSidebar}
          >
            <div className={classes['sidebar-button-text']}>• • •</div>
          </div>
        </div>
        <Chat className={classes.chat} />
      </div>
    </div>
  );
}
export default Home;
