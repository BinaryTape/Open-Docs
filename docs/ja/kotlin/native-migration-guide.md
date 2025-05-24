---
title: 新しいメモリマネージャーへの移行
---
:::note
Kotlin 1.9.20では、従来のメモリマネージャーのサポートが完全に削除されました。プロジェクトを現在のメモリモデルに移行してください。これはKotlin 1.7.20以降、デフォルトで有効になっています。

:::

このガイドでは、新しい[Kotlin/Native memory manager](native-memory-manager)と従来のメモリマネージャーを比較し、プロジェクトを移行する方法について説明します。

新しいメモリマネージャーで最も顕著な変更点は、オブジェクトの共有に関する制限が解除されたことです。スレッド間でオブジェクトを共有するためにオブジェクトをfreezeする必要はありません。具体的には以下のとおりです。

* トップレベルのプロパティは、`@SharedImmutable`を使用しなくても、どのスレッドからでもアクセスおよび変更できます。
* interopを通過するオブジェクトは、freezeしなくても、どのスレッドからでもアクセスおよび変更できます。
* `Worker.executeAfter`は、操作をfreezeする必要がなくなりました。
* `Worker.execute`は、プロデューサーが分離されたオブジェクトサブグラフを返す必要がなくなりました。
* `AtomicReference`と`FreezableAtomicReference`を含む参照サイクルは、メモリリークを引き起こしません。

オブジェクトの簡単な共有に加えて、新しいメモリマネージャーには、他にも大きな変更があります。

* グローバルプロパティは、それらが定義されているファイルが最初にアクセスされたときに遅延初期化されます。以前は、グローバルプロパティはプログラムの起動時に初期化されていました。回避策として、プログラムの起動時に初期化する必要があるプロパティに`@EagerInitialization`アノテーションを付けることができます。使用する前に、その[ドキュメント](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-eager-initialization/)を確認してください。
* `by lazy {}`プロパティは、スレッドセーフモードをサポートし、unbounded recursionを処理しません。
* `Worker.executeAfter`の`operation`からエスケープする例外は、他のランタイム部分と同様に処理されます。つまり、ユーザー定義のunhandled exception hookを実行しようとするか、hookが見つからなかった場合、または例外自体で失敗した場合は、プログラムを終了します。
* freezingは非推奨となり、常に無効になっています。

従来のメモリマネージャーからプロジェクトを移行するには、次のガイドラインに従ってください。

## Update Kotlin

新しいKotlin/Native memory managerは、Kotlin 1.7.20以降、デフォルトで有効になっています。Kotlinのバージョンを確認し、必要に応じて[最新バージョンにアップデート](releases#update-to-a-new-kotlin-version)してください。

## Update dependencies
<h3>kotlinx.coroutines</h3>
<p>
   バージョン1.6.0以降にアップデートしてください。`native-mt`サフィックスが付いたバージョンは使用しないでください。
</p>
<p>
   新しいメモリマネージャーには、注意すべきいくつかの特殊な点もあります。
</p>
<list>
<li>freezingが不要になったため、すべての共通プリミティブ（channels、flows、coroutines）はWorkerの境界を越えて動作します。</li>
<li>`Dispatchers.Default`は、LinuxおよびWindowsではWorkerのプールによって、Appleターゲットではグローバルキューによってバックアップされています。</li>
<li>`newSingleThreadContext`を使用して、Workerによってバックアップされるコルーチンディスパッチャーを作成します。</li>
<li>`newFixedThreadPoolContext`を使用して、`N`個のWorkerのプールによってバックアップされるコルーチンディスパッチャーを作成します。</li>
<li>`Dispatchers.Main`は、Darwinではメインキューによって、他のプラットフォームではスタンドアロンのWorkerによってバックアップされています。</li>
</list>
<h3>Ktor</h3>
        バージョン2.0以降にアップデートしてください。
<h3>Other dependencies</h3>
<p>
   ほとんどのライブラリは変更なしで動作するはずですが、例外があるかもしれません。
</p>
<p>
   依存関係を最新バージョンにアップデートし、従来のメモリマネージャーと新しいメモリマネージャーでライブラリのバージョンに違いがないことを確認してください。
</p>
    

## Update your code

新しいメモリマネージャーをサポートするには、影響を受けるAPIの使用を削除します。

| Old API                                                                                                                                         | What to do                                                                                                                                                        |
|-------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`@SharedImmutable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-shared-immutable/)                                  | すべての使用を削除できます。ただし、新しいメモリマネージャーでこのAPIを使用しても警告は表示されません。                                                             |
| [The `FreezableAtomicReference` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezable-atomic-reference/)      | 代わりに[`AtomicReference`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-atomic-reference/)を使用してください。                                        |
| [The `FreezingException` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezing-exception/)                     | すべての使用を削除してください。                                                                                                                                                |                                                                                                      |
| [The `InvalidMutabilityException` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-invalid-mutability-exception/)  | すべての使用を削除してください。                                                                                                                                                |
| [The `IncorrectDereferenceException` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-incorrect-dereference-exception/)       | すべての使用を削除してください。                                                                                                                                                |
| [The `freeze()` function](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/freeze.html)                                    | すべての使用を削除してください。                                                                                                                                                |
| [The `isFrozen` property](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/is-frozen.html)                                 | すべての使用を削除できます。freezingは非推奨であるため、プロパティは常に`false`を返します。                                                                     |                                                                                                                  
| [The `ensureNeverFrozen()` function](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/ensure-never-frozen.html)            | すべての使用を削除してください。                                                                                                                                                |
| [The `atomicLazy()` function](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/atomic-lazy.html)                           | 代わりに[`lazy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/lazy.html)を使用してください。                                                                            |
| [The `MutableData` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-mutable-data/)                                 | 代わりに、通常のコレクションを使用してください。                                                                                                                               |
| [The `WorkerBoundReference<out T : Any>` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker-bound-reference/) | `T`を直接使用してください。                                                                                                                                                 |
| [The `DetachedObjectGraph<T>` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-detached-object-graph/)             | `T`を直接使用してください。C interopを介して値を渡すには、[the StableRef class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/-stable-ref/)を使用してください。 |

## What's next

* [Learn more about the new memory manager](native-memory-manager)
* [Check the specifics of integration with Swift/Objective-C ARC](native-arc-integration)