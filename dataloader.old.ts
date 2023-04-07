type BatchFunction<K, V> = (keys: K[]) => Promise<V[]>;

/**
 * これだとN+1が解消なかった
 */
export class DataLoader<K, V> {
  private batchFunction: BatchFunction<K, V>;
  private cache: Map<K, Promise<V>>;
  private queue: K[];

  constructor(batchFunction: BatchFunction<K, V>) {
    this.batchFunction = batchFunction;
    this.cache = new Map<K, Promise<V>>();
    this.queue = [];
  }

  async load(key: K): Promise<V> {
    // キャッシュにデータがあれば、それを返す
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    // キーをキューに追加
    this.queue.push(key);

    // キューが処理されるのを待つ
    await this.processQueue();

    // キャッシュから結果を返す
    return this.cache.get(key)!;
  }

  private async processQueue(): Promise<void> {
    // キューが空であれば何もしない
    if (this.queue.length === 0) {
      return;
    }

    // キューを一時的に保存し、新しいキューを作成
    const keysToProcess = this.queue;
    this.queue = [];

    // バッチ関数を実行してデータを取得
    const values = await this.batchFunction(keysToProcess);

    // 結果をキャッシュに保存
    for (let i = 0; i < keysToProcess.length; i++) {
      this.cache.set(keysToProcess[i], Promise.resolve(values[i]));
    }
  }
}
