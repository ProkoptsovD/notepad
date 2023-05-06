export class IndexedDbService {
  /**
   * @param {{ keyPath: string }} config
   */
  constructor({ keyPath, dbName, storageName } = {}) {
    if (!keyPath) this.throwError('Keypath is mandatory');

    this.db = window.indexedDB || window.webkitIndexedDB;
    this.keyPath = keyPath;
    this.dbName = dbName ?? 'notepadDbName';
    this.storeName = storageName ?? 'notepadStore';

    this.logerr = this.logerr.bind(this);
    this.throwError = this.throwError.bind(this);
  }

  /**
   * @param {Function} successCallbackFn // callback used the db open request has success status
   * @param {Function} errorCallbackFn // callback used the db open request has error status
   */
  connectDB(successCallbackFn, errorCallbackFn = this.logerr) {
    if (!successCallbackFn) this.throwError('Succes callback function is mandatory');

    const DbOpenRequest = this.db.open(this.dbName, 1);

    DbOpenRequest.onsuccess = () => successCallbackFn(DbOpenRequest.result);
    DbOpenRequest.onerror = errorCallbackFn;
    DbOpenRequest.onupgradeneeded = ({ currentTarget }) => {
      currentTarget.result.createObjectStore(this.storeName, { keyPath: this.keyPath });

      this.connectDB(successCallbackFn);
    };
  }

  /**
   * @param {{
   *  id: string | number;
   *  onSuccess: () => void;
   *  onError: () => void;
   * }} params
   */
  getRecord({ id, onSuccess, onError = this.logerr }) {
    if (!id) this.throwError('Id key is mandatory');
    if (!onSuccess) this.throwError('Onsuccess callback is mandatory');

    this.connectDB((db) => {
      const dbRequest = db
        .transaction([this.storeName], 'readonly')
        .objectStore(this.storeName)
        .get(id);
      dbRequest.onerror = onError;
      dbRequest.onsuccess = onSuccess;
    }, onError);
  }

  /**
   * @param {{
   *  file: unknown;
   *  onSuccess: () => void;
   *  onError: () => void;
   * }} params
   */
  addRecord({ file, onSuccess, onError = this.logerr }) {
    if (!file) this.throwError('File to be stored is mandatory');
    if (!onSuccess) this.throwError('Onsuccess callback is mandatory');

    this.connectDB((db) => {
      const dbRequest = db
        .transaction([this.storeName], 'readwrite')
        .objectStore(this.storeName)
        .put(file);
      dbRequest.onerror = onError;
      dbRequest.onsuccess = onSuccess;
    }, onError);
  }

  /**
   * @param {{
   *  id: string | number;
   *  onSuccess: () => void;
   *  onError: () => void;
   *  transform: (record: unknown) => record;
   * }} params
   */
  updateRecprd({ id, onSuccess, transform, onError = this.logerr }) {
    if (!id) this.throwError('Id is mandatory');
    if (!onSuccess) this.throwError('onSuccess callback is mandatory');
    if (!transform) this.throwError('transform callback is mandatory');

    this.connectDB((db) => {
      const store = db.transaction([this.storeName], 'readwrite').objectStore(this.storeName);
      const recordRequest = store.get(id);

      recordRequest.onsuccess = () => {
        const file = recordRequest.result;
        const updatedFile = transform(file);
        const updateRequest = store.put(updatedFile);

        updateRequest.onsuccess = onSuccess;
        updateRequest.onerror = onError;
      };
      recordRequest.onerror = onError;
    }, onError);
  }

  /**
   * @param {{
   *  id: string;
   *  onSuccess: () => void;
   *  onError: () => void;
   * }} params
   */
  deleteRecord({ id, onSuccess, onError = this.logerr }) {
    this.connectDB((db) => {
      const dbRequest = db
        .transaction([this.storeName], 'readwrite')
        .objectStore(this.storeName)
        .delete(id);

      dbRequest.onerror = onError;
      dbRequest.onsuccess = onSuccess;
    }, onError);
  }

  /**
   * @param {{
   *  onSuccess: () => void;
   *  onError: () => void;
   * }} params
   */
  getAllRecords({ onSuccess, onError = this.logerr }) {
    this.connectDB((db) => {
      const rows = [];
      const store = db.transaction([this.storeName], 'readonly').objectStore(this.storeName);

      if (store.mozGetAll) {
        const mozStore = store.mozGetAll();
        mozStore.onsuccess = ({ target }) => onSuccess(target.result);
        mozStore.onerror = onError;
      } else {
        const cursor = store.openCursor();

        cursor.onsuccess = ({ target }) => {
          const cursor = target.result;
          if (cursor) {
            rows.push(cursor.value);
            cursor.continue();
          } else {
            onSuccess(rows);
          }
        };
        cursor.onerror = onError;
      }
    }, onError);
  }

  logerr(err) {
    console.log('err -->', err);
  }

  throwError(msg) {
    throw new Error(msg);
  }
}

export const indexedDbService = new IndexedDbService({ keyPath: 'id' });
