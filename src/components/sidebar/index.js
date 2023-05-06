import { NotePreview } from '../notePreview';
import styles from './sidebar.module.css';

/**
 * @param {{
 *   itemsList: Array<{
 *    creationDate: Date;
 *    title: string;
 *    text: string;
 *    id: string;
 *  }>;
 *  onItemClick: (id: string) => void;
 *  activeItem: string;
 * }} props
 * @returns JSX.Element
 */
export function Sidebar({ itemsList, activeItem, ListItemComponent = NotePreview, onItemClick }) {
  return (
    <aside className={styles.sidebar}>
      {itemsList.length ? (
        <ul>
          {itemsList.map(({ id, ...restOfItem }) => (
            <li key={id} className={styles.listItem}>
              <ListItemComponent
                isActive={id === activeItem}
                onClick={onItemClick.bind(null, id)}
                {...restOfItem}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </aside>
  );
}
