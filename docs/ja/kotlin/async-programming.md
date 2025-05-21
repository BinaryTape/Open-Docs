---
title: 非同期プログラミングのテクニック
---
何十年もの間、開発者として、アプリケーションのブロックを防ぐ方法という問題を解決してきました。デスクトップ、モバイル、サーバーサイドのアプリケーションを開発するにしても、ユーザーを待たせたり、アプリケーションのスケーリングを妨げるボトルネックを引き起こしたりすることを避けたいと考えています。

この問題を解決するために、以下のような多くのアプローチが取られてきました。

* [Threading](#threading)
* [Callbacks](#callbacks)
* [Futures, promises, and others](#futures-promises-and-others)
* [Reactive Extensions](#reactive-extensions)
* [Coroutines](#coroutines)

コルーチンが何であるかを説明する前に、他のいくつかの解決策を簡単に見ていきましょう。

## Threading

スレッドは、アプリケーションのブロックを回避するための最もよく知られたアプローチでしょう。

```kotlin
fun postItem(item: Item) {
    val token = preparePost()
    val post = submitPost(token, item)
    processPost(post)
}

fun preparePost(): Token {
    // makes a request and consequently blocks the main thread
    return token
}
```

上記のコードで、`preparePost`が時間のかかるプロセスであり、その結果、ユーザーインターフェースをブロックすると仮定しましょう。その場合、別のスレッドで起動することができます。これにより、UIのブロックを回避できます。これは非常に一般的なテクニックですが、一連の欠点があります。

* スレッドは安価ではありません。スレッドは、コストのかかるコンテキストスイッチを必要とします。
* スレッドは無限ではありません。起動できるスレッドの数は、基盤となるオペレーティングシステムによって制限されます。サーバーサイドアプリケーションでは、これが大きなボトルネックになる可能性があります。
* スレッドは常に利用できるとは限りません。JavaScriptなどの一部のプラットフォームでは、スレッドをサポートしていません。
* スレッドは簡単ではありません。スレッドのデバッグや競合状態の回避は、マルチスレッドプログラミングでよくある問題です。

## Callbacks

コールバックでは、ある関数を別の関数のパラメータとして渡し、プロセスが完了したらそれを呼び出すという考え方です。

```kotlin
fun postItem(item: Item) {
    preparePostAsync { token `->` 
        submitPostAsync(token, item) { post `->` 
            processPost(post)
        }
    }
}

fun preparePostAsync(callback: (Token) `->` Unit) {
    // make request and return immediately 
    // arrange callback to be invoked later
}
```

これは原則として、はるかにエレガントなソリューションのように感じられますが、やはりいくつかの問題があります。

* ネストされたコールバックの難しさ。通常、コールバックとして使用される関数は、独自のコールバックを必要とすることがよくあります。これにより、一連のネストされたコールバックが発生し、理解不能なコードになります。このパターンは、コールバック地獄、またはこれらの深くネストされたコールバックからのインデントが作成する三角形の形状のために、[破滅のピラミッド](https://en.wikipedia.org/wiki/Pyramid_of_doom_(programming))と呼ばれることがよくあります。
* エラー処理が複雑。ネストモデルは、エラー処理とそれらの伝播をやや複雑にします。

コールバックは、JavaScriptなどのイベントループアーキテクチャでは非常に一般的ですが、そこでも一般的に、人々は promises や reactive extensions などの他のアプローチを使用するようになっています。

## Futures, promises, and others

futures または promises (言語またはプラットフォームによっては他の用語が使用される場合があります) の背後にある考え方は、呼び出しを行うときに、ある時点で呼び出しが`Promise`オブジェクトを返すことを_約束_されているということです。その後、そのオブジェクトを操作できます。

```kotlin
fun postItem(item: Item) {
    preparePostAsync() 
        .thenCompose { token `->` 
            submitPostAsync(token, item)
        }
        .thenAccept { post `->` 
            processPost(post)
        }
         
}

fun preparePostAsync(): Promise<Token> {
    // makes request and returns a promise that is completed later
    return promise 
}
```

このアプローチでは、プログラミングの方法に一連の変更が必要です。特に：

* 異なるプログラミングモデル。コールバックと同様に、プログラミングモデルは、トップダウンの命令型アプローチから、チェーンされた呼び出しによる構成モデルに移行します。ループ、例外処理などの従来のプログラム構造は、通常、このモデルでは有効ではありません。
* 異なるAPI。通常、`thenCompose`や`thenAccept`など、完全に新しいAPIを学習する必要があります。これらはプラットフォームによっても異なる場合があります。
* 特定の戻り値の型。戻り値の型は、必要な実際のデータから離れて、イントロスペクトする必要がある新しい型`Promise`を返します。
* エラー処理が複雑になる可能性があります。エラーの伝播とチェーンは、必ずしも簡単ではありません。

## Reactive extensions

Reactive Extensions (Rx) は、[Erik Meijer](https://en.wikipedia.org/wiki/Erik_Meijer_(computer_scientist)) によって C# に導入されました。 .NET プラットフォームで間違いなく使用されていましたが、Netflix が Java に移植し、RxJava と名付けるまで、主流にはなりませんでした。それ以来、JavaScript (RxJS) を含むさまざまなプラットフォーム向けに多数のポートが提供されています。

Rx の背後にある考え方は、いわゆる `observable streams` に移行することです。これにより、データをストリーム (無限量のデータ) として考えるようになり、これらのストリームを監視できます。実際には、Rx は単に [Observer Pattern](https://en.wikipedia.org/wiki/Observer_pattern) に、データを操作できるようにする一連の拡張機能を追加したものです。

アプローチとしては Futures と非常によく似ていますが、Future は個別の要素を返すものとして考えることができますが、Rx はストリームを返します。ただし、前述のものと同様に、プログラミングモデルについてまったく新しい考え方を導入します。これは、次のように有名なフレーズで表現されています。

    "everything is a stream, and it's observable"
    
これは、問題へのアプローチ方法が異なることを意味し、同期コードの作成に慣れていることから大きく変化します。 Futures とは対照的な利点の 1 つは、非常に多くのプラットフォームに移植されているため、C#、Java、JavaScript、または Rx が利用可能なその他の言語を使用する場合でも、一般的に一貫したAPIエクスペリエンスを見つけることができることです。

さらに、Rx はエラー処理に対してやや優れたアプローチを導入します。

## Coroutines

Kotlin の非同期コードの操作に対するアプローチは、コルーチンを使用することです。これは、中断可能な計算、つまり、関数がある時点で実行を中断し、後で再開できるという考え方です。

ただし、コルーチンの利点の 1 つは、開発者にとって、非ブロックコードの作成が本質的にブロックコードの作成と同じであることです。プログラミングモデル自体は実際には変わりません。

たとえば、次のコードを見てください。

```kotlin
fun postItem(item: Item) {
    launch {
        val token = preparePost()
        val post = submitPost(token, item)
        processPost(post)
    }
}

suspend fun preparePost(): Token {
    // makes a request and suspends the coroutine
    return suspendCoroutine { /* ... */ } 
}
```

このコードは、メインスレッドをブロックせずに時間のかかる操作を開始します。 `preparePost` は、いわゆる `suspendable function` であり、したがって、キーワード `suspend` が前に付いています。上記のように、これは、関数が実行され、実行が一時停止され、ある時点で再開されることを意味します。

* 関数のシグネチャはまったく同じままです。唯一の違いは、`suspend` が追加されていることです。ただし、戻り値の型は、返したい型です。
* コードは、本質的にコルーチンを開始する `launch` と呼ばれる関数の使用（他のチュートリアルで説明）を超えて、特別な構文を必要とせずに、同期コードを記述しているかのように、トップダウンで記述されています。
* プログラミングモデルとAPIは同じままです。ループ、例外処理などを引き続き使用でき、新しいAPIの完全なセットを学習する必要はありません。
* プラットフォームに依存しません。 JVM、JavaScript、またはその他のプラットフォームをターゲットにしている場合でも、記述するコードは同じです。内部的には、コンパイラが各プラットフォームに適応するように処理します。

コルーチンは新しい概念ではなく、Kotlin によって発明されたものでもありません。それらは何十年も存在しており、Go などの他のプログラミング言語で人気があります。ただし、注意すべき重要な点は、Kotlin での実装方法では、機能のほとんどがライブラリに委譲されることです。実際、`suspend` キーワードを超えて、他のキーワードは言語に追加されていません。これは、C# などの言語が構文の一部として `async` と `await` を持っているのとは多少異なります。 Kotlin では、これらは単なるライブラリ関数です。

詳細については、[コルーチンのリファレンス](coroutines-overview)を参照してください。