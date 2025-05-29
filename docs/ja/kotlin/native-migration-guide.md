[//]: # (title: 新しいメモリマネージャーへの移行)

> Kotlin 1.9.20で、従来のメモリマネージャーのサポートは完全に削除されました。プロジェクトを現在のメモリモデルに移行してください。このメモリモデルは、Kotlin 1.7.20以降デフォルトで有効になっています。
>
{style="note"}

このガイドでは、新しい[Kotlin/Nativeメモリマネージャー](native-memory-manager.md)と従来のメモリマネージャーを比較し、プロジェクトを移行する方法について説明します。

新しいメモリマネージャーにおける最も顕著な変更点は、オブジェクト共有に関する制限が解除されたことです。スレッド間でオブジェクトを共有するために、オブジェクトをフリーズする必要はありません。具体的には次のとおりです。

*   トップレベルプロパティは、`@SharedImmutable` を使用せずにどのスレッドからでもアクセスおよび変更できます。
*   相互運用（Interop）を介して渡されるオブジェクトは、フリーズせずにどのスレッドからでもアクセスおよび変更できます。
*   `Worker.executeAfter` は、オペレーションがフリーズされていることをもはや必要としません。
*   `Worker.execute` は、プロデューサーが分離されたオブジェクトサブグラフを返すことをもはや必要としません。
*   `AtomicReference` および `FreezableAtomicReference` を含む参照サイクルは、メモリリークを引き起こしません。

オブジェクトの容易な共有とは別に、新しいメモリマネージャーは他にも主要な変更点をもたらします。

*   グローバルプロパティは、それらが定義されているファイルが最初にアクセスされたときに遅延初期化されます。以前は、グローバルプロパティはプログラムの起動時に初期化されていました。回避策として、プログラム起動時に初期化する必要があるプロパティに `@EagerInitialization` アノテーションを付けることができます。使用する前に、その[ドキュメント](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-eager-initialization/)を確認してください。
*   `by lazy {}` プロパティはスレッドセーフティモードをサポートし、無限再帰を処理しません。
*   `Worker.executeAfter` の `operation` から脱出した例外は、他のランタイム部分と同様に処理されます。ユーザー定義の未処理例外フックの実行を試みるか、フックが見つからなかった場合、またはフック自体が例外で失敗した場合にプログラムを終了します。
*   フリーズは非推奨であり、常に無効化されています。

従来のメモリマネージャーからプロジェクトを移行するには、以下のガイドラインに従ってください。

## Kotlinの更新

新しいKotlin/Nativeメモリマネージャーは、Kotlin 1.7.20以降、デフォルトで有効になっています。Kotlinのバージョンを確認し、必要に応じて[最新バージョンに更新](releases.md#update-to-a-new-kotlin-version)してください。

## 依存関係の更新

<deflist style="medium">
    <def title="kotlinx.coroutines">
        <p>バージョン1.6.0以降に更新してください。<code>native-mt</code> サフィックスが付いたバージョンは使用しないでください。</p>
        <p>新しいメモリマネージャーには、留意すべきいくつかの特別な点があります。</p>
        <list>
            <li>フリーズが不要になったため、すべての一般的なプリミティブ（<code>channels</code>、<code>flows</code>、<code>coroutines</code>）はWorkerの境界を越えて動作します。</li>
            <li><code>Dispatchers.Default</code> は、LinuxおよびWindowsではWorkerのプールによってサポートされ、Appleターゲットではグローバルキューによってサポートされます。</li>
            <li><code>newSingleThreadContext</code> を使用して、Workerによってサポートされるコルーチンディスパッチャーを作成します。</li>
            <li><code>newFixedThreadPoolContext</code> を使用して、N個のWorkerのプールによってサポートされるコルーチンディスパッチャーを作成します。</li>
            <li><code>Dispatchers.Main</code> は、Darwinではメインキューによってサポートされ、その他のプラットフォームではスタンドアロンWorkerによってサポートされます。</li>
        </list>
    </def>
    <def title="Ktor">
        バージョン2.0以降に更新してください。
    </def>
    <def title="その他の依存関係">
        <p>ほとんどのライブラリは変更なしで動作するはずですが、例外があるかもしれません。</p>
        <p>依存関係を最新バージョンに更新していること、および従来のメモリマネージャーと新しいメモリマネージャーでライブラリのバージョンに違いがないことを確認してください。</p>
    </def>
</deflist>

## コードの更新

新しいメモリマネージャーをサポートするために、影響を受けるAPIの使用箇所を削除してください。

| 古いAPI                                                                                                                                         | 何をすべきか                                                                                                                                                        |
|:------------------------------------------------------------------------------------------------------------------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`@SharedImmutable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-shared-immutable/)                                  | すべての使用箇所を削除できます。ただし、新しいメモリマネージャーでこのAPIを使用しても警告は出ません。                                                             |
| [<code>FreezableAtomicReference</code> クラス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezable-atomic-reference/)      | 代わりに [`AtomicReference`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-atomic-reference/) を使用してください。                                        |
| [<code>FreezingException</code> クラス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezing-exception/)                     | すべての使用箇所を削除してください。                                                                                                                                                |
| [<code>InvalidMutabilityException</code> クラス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-invalid-mutability-exception/)  | すべての使用箇所を削除してください。                                                                                                                                                |
| [<code>IncorrectDereferenceException</code> クラス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-incorrect-dereference-exception/)       | すべての使用箇所を削除してください。                                                                                                                                                |
| [<code>freeze()</code> 関数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/freeze.html)                                    | すべての使用箇所を削除してください。                                                                                                                                                |
| [<code>isFrozen</code> プロパティ](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/is-frozen.html)                                 | すべての使用箇所を削除できます。フリーズは非推奨になったため、このプロパティは常に `false` を返します。                                                                     |
| [<code>ensureNeverFrozen()</code> 関数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/ensure-never-frozen.html)            | すべての使用箇所を削除してください。                                                                                                                                                |
| [<code>atomicLazy()</code> 関数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/atomic-lazy.html)                           | 代わりに [`lazy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/lazy.html) を使用してください。                                                                            |
| [<code>MutableData</code> クラス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-mutable-data/)                                 | 代わりに通常のコレクションを使用してください。                                                                                                                               |
| [<code>WorkerBoundReference&lt;out T : Any&gt;</code> クラス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker-bound-reference/) | `T` を直接使用してください。                                                                                                                                                 |
| [<code>DetachedObjectGraph&lt;T&gt;</code> クラス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-detached-object-graph/)             | `T` を直接使用してください。C interopを介して値を渡すには、[StableRefクラス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/-stable-ref/)を使用してください。 |

## 次のステップ

*   [新しいメモリマネージャーについてさらに学ぶ](native-memory-manager.md)
*   [Swift/Objective-C ARCとの統合の詳細を確認する](native-arc-integration.md)
*   [異なるコルーチンから安全にオブジェクトを参照する方法を学ぶ](native-faq.md#how-do-i-reference-objects-safely-from-different-coroutines)