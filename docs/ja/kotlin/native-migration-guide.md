[//]: # (title: 新しいメモリマネージャーへの移行)

> レガシーメモリマネージャーのサポートは、Kotlin 1.9.20 で完全に削除されました。Kotlin 1.7.20 以降でデフォルトで有効になっている現在のメモリモデルにプロジェクトを移行してください。
>
{style="note"}

このガイドでは、新しい [Kotlin/Native メモリマネージャー](native-memory-manager.md)をレガシーなものと比較し、プロジェクトの移行方法について説明します。

新しいメモリマネージャーにおける最も顕著な変更点は、オブジェクト共有に関する制限が解除されたことです。スレッド間でオブジェクトを共有するためにオブジェクトをフリーズ（freeze）する必要はありません。具体的には以下の通りです：

*   トップレベルのプロパティは、`@SharedImmutable` を使用せずに任意のスレッドからアクセスおよび変更できます。
*   インターオペラビリティ（interop）を介して渡されるオブジェクトは、フリーズすることなく任意のスレッドからアクセスおよび変更できます。
*   `Worker.executeAfter` は、オペレーションをフリーズさせる必要がなくなりました。
*   `Worker.execute` は、プロデューサーが分離されたオブジェクトサブグラフ（isolated object subgraph）を返す必要がなくなりました。
*   `AtomicReference` および `FreezableAtomicReference` を含む循環参照は、メモリリークを引き起こしません。

オブジェクト共有が容易になったこと以外にも、新しいメモリマネージャーにはいくつかの大きな変更点があります：

*   グローバルプロパティは、それが定義されているファイルに最初にアクセスしたときに遅延初期化されます。以前は、グローバルプロパティはプログラムの起動時に初期化されていました。回避策として、プログラムの開始時に初期化する必要があるプロパティには `@EagerInitialization` アノテーションを付けることができます。使用する前に、その[ドキュメント](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-eager-initialization/)を確認してください。
*   `by lazy {}` プロパティはスレッドセーフモードをサポートし、制限のない再帰（unbounded recursion）は処理しません。
*   `Worker.executeAfter` 内の `operation` から発生した例外は、他のランタイム部分と同様に処理されます。具体的には、ユーザー定義の未処理例外フック（unhandled exception hook）の実行を試みるか、フックが見つからない、またはフック自体が例外で失敗した場合はプログラムを終了します。
*   フリーズ（Freezing）は非推奨となり、常に無効化されます。

レガシーメモリマネージャーからプロジェクトを移行するには、以下のガイドラインに従ってください：

## Kotlin のアップデート

新しい Kotlin/Native メモリマネージャーは、Kotlin 1.7.20 以降、デフォルトで有効になっています。Kotlin のバージョンを確認し、必要に応じて[最新バージョンにアップデート](releases.md#update-to-a-new-kotlin-version)してください。

## 依存関係のアップデート

<deflist style="medium">
    <def title="kotlinx.coroutines">
        <p>バージョン 1.6.0 以降にアップデートしてください。<code>native-mt</code> サフィックスが付いたバージョンは使用しないでください。</p>
        <p>新しいメモリマネージャーに関して、留意すべきいくつかの特記事項もあります：</p>
        <list>
            <li>フリーズが不要になったため、すべての一般的なプリミティブ（チャネル、フロー、コルーチン）は Worker の境界を越えて動作します。</li>
            <li><code>Dispatchers.Default</code> は、Linux および Windows では Worker のプール、Apple ターゲットではグローバルキューによってバックアップされます。</li>
            <li>Worker によってバックアップされるコルーチンディスパッチャを作成するには、<code>newSingleThreadContext</code> を使用します。</li>
            <li><code>N</code> 個の Worker のプールによってバックアップされるコルーチンディスパッチャを作成するには、<code>newFixedThreadPoolContext</code> を使用します。</li>
            <li><code>Dispatchers.Main</code> は、Darwin ではメインキュー、その他のプラットフォームではスタンドアロンの Worker によってバックアップされます。</li>
        </list>
    </def>
    <def title="Ktor">
        バージョン 2.0 以降にアップデートしてください。
    </def>
    <def title="その他の依存関係">
        <p>大部分のライブラリは変更なしで動作するはずですが、例外がある場合があります。</p>
        <p>依存関係を最新バージョンに更新し、レガシーメモリマネージャー用と新しいメモリマネージャー用のライブラリバージョンに違いがないことを確認してください。</p>
    </def>
</deflist>

## コードのアップデート

新しいメモリマネージャーをサポートするために、影響を受ける API の使用箇所を削除してください：

| 旧 API                                                                                                                                         | 対応方法                                                                                                                                                        |
|-------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`@SharedImmutable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-shared-immutable/)                                  | すべての使用箇所を削除できます。ただし、新しいメモリマネージャーでこの API を使用しても警告は出ません。                                                             |
| [`FreezableAtomicReference` クラス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezable-atomic-reference/)      | 代わりに [`AtomicReference`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-atomic-reference/) を使用してください。                                        |
| [`FreezingException` クラス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezing-exception/)                     | すべての使用箇所を削除してください。                                                                                                                                                |
| [`InvalidMutabilityException` クラス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-invalid-mutability-exception/)  | すべての使用箇所を削除してください。                                                                                                                                                |
| [`IncorrectDereferenceException` クラス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-incorrect-dereference-exception/)       | すべての使用箇所を削除してください。                                                                                                                                                |
| [`freeze()` 関数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/freeze.html)                                    | すべての使用箇所を削除してください。                                                                                                                                                |
| [`isFrozen` プロパティ](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/is-frozen.html)                                 | すべての使用箇所を削除できます。フリーズは非推奨であるため、このプロパティは常に `false` を返します。                                                                     |                                                                                                                  
| [`ensureNeverFrozen()` 関数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/ensure-never-frozen.html)            | すべての使用箇所を削除してください。                                                                                                                                                |
| [`atomicLazy()` 関数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/atomic-lazy.html)                           | 代わりに [`lazy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/lazy.html) を使用してください。                                                                            |
| [`MutableData` クラス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-mutable-data/)                                 | 代わりに任意の通常のコレクションを使用してください。                                                                                                                               |
| [`WorkerBoundReference<out T : Any>` クラス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker-bound-reference/) | `T` を直接使用してください。                                                                                                                                                 |
| [`DetachedObjectGraph<T>` クラス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-detached-object-graph/)             | `T` を直接使用してください。C インターオペラビリティを介して値を渡すには、[StableRef クラス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/-stable-ref/)を使用してください。 |

## 次のステップ

* [新しいメモリマネージャーについて詳しく学ぶ](native-memory-manager.md)
* [Swift/Objective-C ARC との統合における特記事項を確認する](native-arc-integration.md)
* [異なるコルーチンからオブジェクトを安全に参照する方法を学ぶ](native-faq.md#how-do-i-reference-objects-safely-from-different-coroutines)