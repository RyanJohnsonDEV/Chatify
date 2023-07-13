/* eslint-disable react/prop-types */
import classes from './FormPanel.module.css';

function FormPanel(props) {
  return (
    <div className={classes.panel}>
      <div className={classes['panel-container']}>{props.children}</div>
    </div>
  );
}
export default FormPanel;
