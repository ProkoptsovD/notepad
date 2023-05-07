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
export function Sidebar({
  itemsList,
  activeItem,
  dateFormatFn,
  ListItemComponent = NotePreview,
  onItemClick
}) {
  const hasItems = itemsList?.length > 0;

  return (
    <aside className={styles.sidebar}>
      {hasItems ? (
        <ul>
          {itemsList.map(({ id, ...restOfItem }) => (
            <li key={id} className={styles.listItem}>
              <ListItemComponent
                isActive={id === activeItem}
                onClick={onItemClick.bind(null, id)}
                dateFormatFn={dateFormatFn}
                {...restOfItem}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.notification}>Added notes will be displayed here</p>
      )}
    </aside>
  );
}
