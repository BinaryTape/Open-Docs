[//]: # (title: コルーチン)

アプリケーションは、ユーザー入力への応答、データの読み込み、画面の更新など、複数のタスクを同時に実行する必要があることがよくあります。
これをサポートするために、アプリケーションは並行処理に依存します。これにより、操作は互いにブロックすることなく独立して実行できます。

タスクを並行して実行する最も一般的な方法はスレッドを使用することです。スレッドは、オペレーティングシステムによって管理される独立した実行パスです。
しかし、スレッドは比較的重く、多数作成するとパフォーマンス上の問題につながる可能性があります。

効率的な並行処理をサポートするために、Kotlinは_コルーチン_を中心に構築された非同期プログラミングを使用しています。コルーチンを使用すると、サスペンド関数を使って非同期コードを自然なシーケンシャルスタイルで記述できます。
コルーチンは、スレッドに代わる軽量な手段です。
これらはシステムリソースをブロックすることなくサスペンドでき、リソースに優しいため、細粒度の並行処理に適しています。

ほとんどのコルーチン機能は、[`kotlinx.coroutines`](https://github.com/Kotlin/kotlinx.coroutines)ライブラリによって提供されています。
このライブラリには、コルーチンの起動、並行処理の管理、非同期ストリームの操作などを行うためのツールが含まれています。

Kotlinのコルーチンを初めて使用する場合は、より複雑なトピックに進む前に、[コルーチンの基本](coroutines-basics.md)ガイドから始めてください。
このガイドでは、サスペンド関数、コルーチンビルダー、構造化された並行処理の主要な概念を簡単な例を通して紹介します。

<a href="coroutines-basics.md"><img src="get-started-coroutines.svg" width="700" alt="Get started with coroutines" style="block"/></a>

> コルーチンが実際にどのように使用されているかについては、[KotlinConf アプリ](https://github.com/JetBrains/kotlinconf-app)のサンプルプロジェクトを確認してください。
> 
{style="tip"}

## コルーチンの概念

`kotlinx.coroutines`ライブラリは、タスクを並行して実行し、コルーチン実行を構造化し、共有状態を管理するためのコアとなる構成要素を提供します。

### サスペンド関数とコルーチンビルダー

Kotlinのコルーチンはサスペンド関数に基づいて構築されており、これによりコードはスレッドをブロックすることなく一時停止および再開できます。
`suspend`キーワードは、長時間実行される処理を非同期的に実行できる関数をマークします。

新しいコルーチンを起動するには、[`.launch()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html)や[`.async()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html)のようなコルーチンビルダーを使用します。
これらのビルダーは、[`CoroutineScope`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/)の拡張関数であり、
コルーチンのライフサイクルを定義し、コルーチンコンテキストを提供します。

これらのビルダーの詳細については、[コルーチンの基本](coroutines-basics.md)と[サスペンド関数の組み合わせ](coroutines-and-channels.md)を参照してください。

### コルーチンコンテキストと動作

`CoroutineScope`からコルーチンを起動すると、その実行を制御するコンテキストが作成されます。
`.launch()`や`.async()`などのビルダー関数は、コルーチンがどのように動作するかを定義する一連の要素を自動的に作成します。

* [`Job`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/)インターフェースは、コルーチンのライフサイクルを追跡し、構造化された並行処理を可能にします。
* [`CoroutineDispatcher`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-dispatcher/)は、コルーチンがどこで実行されるかを制御します。例えば、バックグラウンドスレッドやUIアプリケーションのメインスレッドなどです。
* [`CoroutineExceptionHandler`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-exception-handler/)は、キャッチされない例外を処理します。

これらは、その他の可能な要素とともに、[_コルーチンコンテキスト_](coroutine-context-and-dispatchers.md)を構成します。これはデフォルトでコルーチンの親から継承されます。
このコンテキストは、構造化された並行処理を可能にする階層を形成します。これにより、関連するコルーチンをまとめて[キャンセル](cancellation-and-timeouts.md)したり、グループとして[例外を処理](exception-handling.md)したりできます。

### 非同期フローと共有可変状態

Kotlinは、コルーチンが通信するためのいくつかの方法を提供します。
コルーチン間で値を共有する方法に応じて、次のいずれかのオプションを使用します。

* [`Flow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow/)は、コルーチンがアクティブに値を収集した場合にのみ値を生成します。
* [`Channel`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-channel/)は、複数のコルーチンが値を送受信できるようにし、各値は厳密に1つのコルーチンに配信されます。
* [`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/)は、すべてのアクティブな収集中のコルーチンとすべての値を継続的に共有します。

複数のコルーチンが同じデータにアクセスまたは更新する必要がある場合、それらは_可変状態を共有_します。
連携がなければ、予測不可能な方法で操作が互いに干渉する競合状態につながる可能性があります。
共有可変状態を安全に管理するには、[`StateFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-state-flow/#)を使用して共有データをラップします。
その後、1つのコルーチンから更新し、他のコルーチンからその最新の値を収集できます。
<!-- Learn more in [Shared mutable state and concurrency](shared-mutable-state-and-concurrency.md). -->

詳細については、[非同期フロー](flow.md)、[チャネル](channels.md)、および[コルーチンとチャネルのチュートリアル](coroutines-and-channels.md)を参照してください。

## 次のステップ

* [コルーチンの基本ガイド](coroutines-basics.md)で、コルーチン、サスペンド関数、およびビルダーの基本を学びます。
* [サスペンド関数の組み合わせ](coroutine-context-and-dispatchers.md)で、サスペンド関数を組み合わせてコルーチンパイプラインを構築する方法を探求します。
* IntelliJ IDEAの組み込みツールを使用して[コルーチンをデバッグする](debug-coroutines-with-idea.md)方法を学びます。
* Flowに特化したデバッグについては、[IntelliJ IDEA を使用して Kotlin Flow をデバッグする](debug-flow-with-idea.md)チュートリアルを参照してください。
* コルーチンベースのUI開発については、[コルーチンを使用したUIプログラミングガイド](https://github.com/Kotlin/kotlinx.coroutines/blob/master/ui/coroutines-guide-ui.md)を読んでください。
* [Androidでコルーチンを使用するためのベストプラクティス](https://developer.android.com/kotlin/coroutines/coroutines-best-practices)を確認してください。
* [`kotlinx.coroutines` APIリファレンス](https://kotlinlang.org/api/kotlinx.coroutines/)を確認してください。