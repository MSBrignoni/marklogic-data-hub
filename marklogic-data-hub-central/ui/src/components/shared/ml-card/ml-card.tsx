import React from "react";
import {Card, CardProps} from "react-bootstrap";
import styles from "./ml-card.module.scss";


export interface MLCardProps extends CardProps {
  actions?: any[],
  titleExtra?: any,
  bodyClassName?: string,
  footerClassName?: string
}

function MLCard({className, actions, title, titleExtra, bodyClassName, footerClassName, children, ...others}: MLCardProps): JSX.Element {

  var percentage = actions ? 100 / actions.length + '%' : '100%';

  return(
    <Card className={`${styles.cardStyle} ${className}`} {...others}>
      {title && <Card.Header bsPrefix={styles.header}>
        <label className={styles.title}>{title}</label> {titleExtra}
        </Card.Header>}
      <Card.Body className={bodyClassName}>
        {children}
      </Card.Body>
      {actions && <Card.Footer className={` ${styles.footer} ${styles.card} ${footerClassName}`}>
        <ul className={styles.footerContent}>
          {actions.map((action, index) =>
          <li key={index} style={{width: percentage}}>
            {action}
          </li>
          )}
        </ul>
      </Card.Footer>}
    </Card>
  );
}

export default MLCard;