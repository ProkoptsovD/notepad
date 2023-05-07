import React from 'react';
import styles from './actionBox.module.css';

/**
 * @param {{
 *  actionButtonsList: Array<{
 *    Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>;
 *    onClick: () => void;
 *    disabled: boolean;
 *  }>;
 *  ButtonComponent: React.FunctionComponent<{onClick: () => void; children: React.Node; [x: string]: unknown}>
 * }} params
 * @returns
 */
export function ActionBox({ actionButtonsList = [], ButtonComponent = ActionButton }) {
  return (
    <ul className={styles.actionBox}>
      {actionButtonsList.map(({ Icon, onClick, disabled }, idx) => (
        <li key={idx} className={styles.actionBoxListItem}>
          <ButtonComponent onClick={onClick} disabled={disabled}>
            <Icon />
          </ButtonComponent>
        </li>
      ))}
    </ul>
  );
}

function ActionButton({ onClick, children, ...restProps }) {
  return (
    <button type="button" className={styles.actionButton} onClick={onClick} {...restProps}>
      {children}
    </button>
  );
}
