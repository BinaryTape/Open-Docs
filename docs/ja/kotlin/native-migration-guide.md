[//]: # (title: 新しいメモリーマネージャーへの移行)

> 従来のメモリーマネージャーのサポートは、Kotlin 1.9.20で完全に削除されました。プロジェクトを現在のメモリーモデル（Kotlin 1.7.20以降でデフォルトで有効）に移行してください。
>
{style="note"}

このガイドでは、新しい[Kotlin/Nativeメモリーマネージャー](native-memory-manager.md)と従来のマネージャーを比較し、プロジェクトを移行する方法について説明します。

新しいメモリーマネージャーで最も顕著な変更点は、オブジェクト共有に関する制限が解除されたことです。オブジェクトをスレッド間で共有するためにフリーズする必要がなくなりました。具体的には次のとおりです。

*   トップレベルプロパティは、`@SharedImmutable`を使用せずに、どのスレッドからもアクセスおよび変更できます。
*   相互運用経由で渡されるオブジェクトは、フリーズせずに、どのスレッドからもアクセスおよび変更できます。
*   `Worker.executeAfter`は、操作がフリーズされている必要がなくなりました。
*   `Worker.execute`は、プロデューサーが分離されたオブジェクトサブグラフを返す必要がなくなりました。
*   `AtomicReference`および`FreezableAtomicReference`を含む参照サイクルは、メモリーリークを引き起こしません。

容易なオブジェクト共有以外にも、新しいメモリーマネージャーには他の主要な変更点があります。

*   グローバルプロパティは、それらが定義されているファイルに最初にアクセスされたときに遅延初期化されます。以前は、グローバルプロパティはプログラムの起動時に初期化されていました。回避策として、プログラムの起動時に初期化する必要があるプロパティには、`@EagerInitialization`アノテーションを付けてマークできます。使用する前に、その[ドキュメント](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-eager-initialization/)を確認してください。
*   `by lazy {}`プロパティは、スレッドセーフティモードをサポートし、無制限の再帰を処理しません。
*   `Worker.executeAfter`の`operation`から逸脱した例外は、他のランタイム部分と同様に処理されます。ユーザー定義の未処理例外フックを実行しようとするか、フックが見つからないか、フック自体が例外で失敗した場合はプログラムを終了します。
*   フリーズは非推奨となり、常に無効化されます。

従来のメモリーマネージャーからプロジェクトを移行するには、次のガイドラインに従ってください。

## Kotlinの更新

新しいKotlin/Nativeメモリーマネージャーは、Kotlin 1.7.20以降でデフォルトで有効になっています。Kotlinのバージョンを確認し、必要に応じて[最新版に更新してください](releases.md#update-to-a-new-kotlin-version)。

## 依存関係の更新

<deflist style="medium">
    <def title="kotlinx.coroutines">
        <p>バージョン1.6.0以降に更新してください。<code>native-mt</code>サフィックスの付いたバージョンは使用しないでください。</p>
        <p>また、新しいメモリーマネージャーには、考慮すべきいくつかの詳細があります。</p>
        <list>
            <li>フリーズが不要になったため、すべての一般的なプリミティブ（チャネル、フロー、コルーチン）はWorker境界を越えて機能します。</li>
            <li><code>Dispatchers.Default</code>は、LinuxとWindowsではWorkerのプールによって、Appleターゲットではグローバルキューによって支えられています。</li>
            <li><code>newSingleThreadContext</code>を使用して、Workerによって支えられたコルーチンディスパッチャーを作成してください。</li>
            <li><code>newFixedThreadPoolContext</code>を使用して、<code>N</code>個のWorkerのプールによって支えられたコルーチンディスパッチャーを作成してください。</li>
            <li><code>Dispatchers.Main</code>は、Darwinではメインキューによって、その他のプラットフォームではスタンドアロンWorkerによって支えられています。</li>
        </list>
    </def>
    <def title="Ktor">
        バージョン2.0以降に更新してください。
    </def>
    <def title="その他の依存関係">
        <p>ほとんどのライブラリは変更なしで動作するはずですが、例外があるかもしれません。</p>
        <p>依存関係を最新バージョンに更新し、従来のメモリーマネージャーと新しいメモリーマネージャーでライブラリのバージョンに違いがないことを確認してください。</p>
    </def>
</deflist>

## コードの更新

新しいメモリーマネージャーをサポートするには、影響を受けるAPIの使用を削除してください。

| 古いAPI                                                                                                                                         | 対応                                                                                                                                                        |
|-------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`@SharedImmutable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-shared-immutable/)                                  | すべての使用箇所を削除できます。ただし、新しいメモリーマネージャーでこのAPIを使用しても警告は表示されません。                                                             |
| [`FreezableAtomicReference` クラス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezable-atomic-reference/)      | 代わりに[`AtomicReference`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-atomic-reference/)を使用してください。                                        |
| [`FreezingException` クラス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezing-exception/)                     | すべての使用箇所を削除してください。                                                                                                                                                |
| [`InvalidMutabilityException` クラス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-invalid-mutability-exception/)  | すべての使用箇所を削除してください。                                                                                                                                                |
| [`IncorrectDereferenceException` クラス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-incorrect-dereference-exception/)       | すべての使用箇所を削除してください。                                                                                                                                                |
| [`freeze()` 関数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/freeze.html)                                    | すべての使用箇所を削除してください。                                                                                                                                                |
| [`isFrozen` プロパティ](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/is-frozen.html)                                 | すべての使用箇所を削除できます。フリーズは非推奨であるため、このプロパティは常に<code>false</code>を返します。                                                                     |
| [`ensureNeverFrozen()` 関数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/ensure-never-frozen.html)            | すべての使用箇所を削除してください。                                                                                                                                                |
| [`atomicLazy()` 関数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/atomic-lazy.html)                           | 代わりに[`lazy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/lazy.html)を使用してください。                                                                            |
| [`MutableData` クラス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-mutable-data/)                                 | 代わりに通常のコレクションを使用してください。                                                                                                                               |
| [`WorkerBoundReference<out T : Any>` クラス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker-bound-reference/) | <code>T</code>を直接使用してください。                                                                                                                                                 |
| [`DetachedObjectGraph<T>` クラス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-detached-object-graph/)             | <code>T</code>を直接使用してください。C相互運用経由で値を渡すには、[StableRefクラス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/-stable-ref/)を使用してください。 |

## 次に行うこと

*   [新しいメモリーマネージャーについて詳しく学ぶ](native-memory-manager.md)
*   [Swift/Objective-C ARCとの統合の具体例を確認する](native-arc-integration.md)
*   [異なるコルーチンからオブジェクトを安全に参照する方法を学ぶ](native-faq.md#how-do-i-reference-objects-safely-from-different-coroutines)