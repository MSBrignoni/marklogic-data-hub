import React from "react";
import {Card, CardProps} from "react-bootstrap";
import styles from "./ml-card.module.scss"

export interface MLCardProps extends CardProps {
  actions?: [],
}

function MLCard({className, actions, children, ...others}: MLCardProps) {

  var percentage = actions ? 100 / actions.length + '%' : '100%';

  return(
    <Card className={`${styles.cardStyle} ${className}`} {...others}>
      <Card.Body>
        {children}
      </Card.Body>
      {actions && <Card.Footer className={styles.footer}>
        <ul className={styles.footerContent}>
        {actions.map((action) => 
          <li style={{width: percentage}}>
            {action}
          </li>
          )}
        </ul>
      </Card.Footer>}
    </Card>
  );
}

export default MLCard;