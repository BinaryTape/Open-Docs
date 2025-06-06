[//]: # (title: 非同期プログラミングのテクニック)

開発者である私たちは何十年もの間、「アプリケーションがブロッキングするのを防ぐにはどうすればよいか」という問題に直面してきました。デスクトップ、モバイル、あるいはサーバーサイドアプリケーションを開発している場合でも、ユーザーを待たせることや、さらに悪いことにアプリケーションのスケーリングを妨げるボトルネックを引き起こすことを避けたいと考えています。

この問題を解決するために、これまでに多くの方法がとられてきました。

*   [スレッディング](#threading)
*   [コールバック](#callbacks)
*   [Future、Promise、およびその他](#futures-promises-and-others)
*   [Reactive Extensions](#reactive-extensions)
*   [コルーチン](#coroutines)

コルーチンとは何かを説明する前に、他の解決策のいくつかについて簡単に見ていきましょう。

## スレッディング

スレッドは、アプリケーションがブロッキングするのを回避するための、おそらく最もよく知られたアプローチです。

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

上記のコードで`preparePost`が長時間実行されるプロセスであり、その結果としてユーザーインターフェースをブロックすると仮定しましょう。私たちができることは、これを別のスレッドで起動することです。そうすることで、UIがブロックされるのを回避できます。これは非常に一般的なテクニックですが、いくつかの欠点があります。

*   スレッドはコストが高い。スレッドはコストのかかるコンテキストスイッチを必要とします。
*   スレッドは無限ではない。起動できるスレッドの数は、基盤となるオペレーティングシステムによって制限されます。サーバーサイドアプリケーションでは、これが大きなボトルネックになる可能性があります。
*   スレッドは常に利用可能ではない。JavaScriptのような一部のプラットフォームでは、スレッドをサポートしていません。
*   スレッドは簡単ではない。スレッドのデバッグや競合状態の回避は、マルチスレッドプログラミングでよく直面する問題です。

## コールバック

コールバックの考え方は、ある関数を別の関数の引数として渡し、プロセスが完了したときにその関数が呼び出されるようにすることです。

```kotlin
fun postItem(item: Item) {
    preparePostAsync { token -> 
        submitPostAsync(token, item) { post -> 
            processPost(post)
        }
    }
}

fun preparePostAsync(callback: (Token) -> Unit) {
    // make request and return immediately 
    // arrange callback to be invoked later
}
```

これは原則として、はるかに洗練された解決策のように思えますが、ここでもいくつかの問題があります。

*   ネストされたコールバックの難しさ。通常、コールバックとして使用される関数は、しばしば自身のコールバックを必要とすることになります。これにより、一連のネストされたコールバックが発生し、理解しにくいコードにつながります。深くネストされたコールバックによるインデントが三角形の形を作るため、このパターンはしばしばコールバック地獄、または[破滅のピラミッド](https://en.wikipedia.org/wiki/Pyramid_of_doom_(programming))と呼ばれます。
*   エラーハンドリングは複雑になります。ネストされたモデルは、エラーハンドリングとその伝播を多少複雑にします。

コールバックはJavaScriptのようなイベントループアーキテクチャでは非常に一般的ですが、そこですら、一般的にはPromiseやReactive Extensionsのような他のアプローチへと移行しています。

## Future、Promise、およびその他

FutureやPromise（言語やプラットフォームによっては他の用語が使われることもあります）の背後にある考え方は、呼び出しを行うと、ある時点でその呼び出しが`Promise`オブジェクトを返すことが_約束_され、そのオブジェクトに対して操作を行えるというものです。

```kotlin
fun postItem(item: Item) {
    preparePostAsync() 
        .thenCompose { token -> 
            submitPostAsync(token, item)
        }
        .thenAccept { post -> 
            processPost(post)
        }
         
}

fun preparePostAsync(): Promise<Token> {
    // makes request and returns a promise that is completed later
    return promise 
}
```

このアプローチは、プログラミングの方法に一連の変更を要求します。特に、次の点が挙げられます。

*   異なるプログラミングモデル。コールバックと同様に、プログラミングモデルはトップダウンの命令型アプローチから、チェインされた呼び出しによるコンポジションモデルへと移行します。ループ、例外処理などの従来のプログラム構造は、通常このモデルでは有効ではありません。
*   異なるAPI。通常、`thenCompose`や`thenAccept`のような全く新しいAPIを学ぶ必要があり、これらはプラットフォームによって異なる場合があります。
*   特定の戻り型。戻り型は、必要な実際のデータから離れて、代わりに調査する必要がある新しい型`Promise`を返します。
*   エラーハンドリングは複雑になることがあります。エラーの伝播とチェインは常に単純ではありません。

## Reactive Extensions

Reactive Extensions (Rx) は、[エリック・マイヤー](https://en.wikipedia.org/wiki/Erik_Meijer_(computer_scientist))によってC#に導入されました。当初は.NETプラットフォームで確かに使用されていましたが、NetflixがJavaに移植し、RxJavaと名付けてから主流の採用を本当に獲得しました。それ以来、JavaScript (RxJS) を含む様々なプラットフォーム向けに多数のポートが提供されています。

Rxの背後にある考え方は、`オブザーバブルストリーム`と呼ばれるものへと移行することです。これにより、データをストリーム（無限の量のデータ）として捉え、これらのストリームを監視できるようになります。実用的な観点では、Rxは単にデータを操作できるようにするための一連の拡張を備えた[Observerパターン](https://en.wikipedia.org/wiki/Observer_pattern)です。

このアプローチはFutureと非常に似ていますが、Futureが個別の要素を返すと考えることができるのに対し、Rxはストリームを返します。ただし、前述のアプローチと同様に、これもプログラミングモデルについて全く新しい考え方を導入します。これは、

    「すべてはストリームであり、観測可能である」

という有名な言葉で表現されています。

これは、問題へのアプローチ方法が異なり、同期コードを書くことに慣れている私たちにとってはかなり大きな変化を意味します。Futureとは対照的に、Rxは非常に多くのプラットフォームに移植されているため、C#、Java、JavaScript、またはRxが利用可能な他のどの言語を使用しても、一般的に一貫したAPIエクスペリエンスを見つけることができるという利点があります。

さらに、Rxはエラーハンドリングに対し、多少より良いアプローチを導入しています。

## コルーチン

Kotlinの非同期コードを扱うアプローチは、コルーチンを使用することです。これはサスペンド可能な計算という考え方、つまり関数がある時点で実行を中断し、後で再開できるという考え方です。

しかし、コルーチンの利点の1つは、開発者にとって、ノンブロッキングコードを書くことが実質的にブロッキングコードを書くことと同じになる点です。プログラミングモデル自体は実際には変化しません。

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

このコードは、メインスレッドをブロックすることなく長時間実行される操作を起動します。`preparePost`は`サスペンド関数`と呼ばれるもので、そのため`suspend`キーワードがプレフィックスとして付いています。これは、前述のとおり、関数が実行され、実行を一時停止し、ある時点で再開することを意味します。

*   関数シグネチャはまったく同じままです。唯一の違いは`suspend`が追加されることだけです。ただし、戻り型は私たちが返したい型になります。
*   コルーチンを本質的に開始する`launch`と呼ばれる関数の使用を除いて（他のチュートリアルで説明されています）、特別な構文は必要なく、同期コードを書くように、トップダウンで記述されます。
*   プログラミングモデルとAPIは同じままです。ループや例外処理などを引き続き使用でき、全く新しいAPIのセットを学ぶ必要はありません。
*   プラットフォーム非依存です。JVM、JavaScript、またはその他のプラットフォームをターゲットにしているかどうかにかかわらず、記述するコードは同じです。内部的には、コンパイラが各プラットフォームに適応させる処理を行います。

コルーチンは新しい概念ではなく、ましてやKotlinによって発明されたものではありません。これらは何十年も前から存在し、Goのような他のプログラミング言語でも人気があります。しかし、重要な注意点は、Kotlinでの実装方法として、その機能のほとんどがライブラリに委譲されていることです。実際、`suspend`キーワード以外に、言語にキーワードは追加されていません。これは、`async`と`await`が構文の一部であるC#のような言語とは多少異なります。Kotlinでは、これらは単なるライブラリ関数です。

詳細については、[コルーチンリファレンス](coroutines-overview.md)を参照してください。