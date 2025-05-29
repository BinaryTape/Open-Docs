<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: コルーチンガイド)

Kotlinは、その標準ライブラリにおいて、他のライブラリがコルーチンを利用できるように、最小限の低レベルAPIしか提供していません。同様の機能を持つ他の多くの言語とは異なり、`async`や`await`はKotlinのキーワードではなく、標準ライブラリの一部ですらありません。さらに、Kotlinの_中断関数_の概念は、futuresやpromisesよりも、非同期操作に対してより安全でエラーの少ない抽象化を提供します。

`kotlinx.coroutines` はJetBrainsによって開発された、コルーチンのための豊富なライブラリです。このガイドでは、`launch`、`async`などを含む、多くの高レベルなコルーチン対応プリミティブについて解説します。

これは、`kotlinx.coroutines`のコア機能について、様々なトピックに分けられた一連の例とともに解説するガイドです。

コルーチンを使用し、このガイドの例に従うには、[プロジェクトのREADME](https://github.com/Kotlin/kotlinx.coroutines/blob/master/README.md#using-in-your-projects)で説明されているように、`kotlinx-coroutines-core`モジュールへの依存関係を追加する必要があります。

## 目次

* [コルーチンの基本](coroutines-basics.md)
* [チュートリアル: コルーチンとチャネルの紹介](coroutines-and-channels.md)
* [キャンセルとタイムアウト](cancellation-and-timeouts.md)
* [中断関数の結合](composing-suspending-functions.md)
* [コルーチンコンテキストとディスパッチャー](coroutine-context-and-dispatchers.md)
* [非同期フロー](flow.md)
* [チャネル](channels.md)
* [コルーチン例外処理](exception-handling.md)
* [共有ミュータブル状態と並行処理](shared-mutable-state-and-concurrency.md)
* [select式 (実験的)](select-expression.md)
* [チュートリアル: IntelliJ IDEAを使ったコルーチンのデバッグ](debug-coroutines-with-idea.md)
* [チュートリアル: IntelliJ IDEAを使ったKotlin Flowのデバッグ](debug-flow-with-idea.md)

## その他の参考資料

* [コルーチンを使ったUIプログラミングガイド](https://github.com/Kotlin/kotlinx.coroutines/blob/master/ui/coroutines-guide-ui.md)
* [コルーチン設計ドキュメント (KEEP)](https://github.com/Kotlin/KEEP/blob/master/proposals/coroutines.md)
* [完全なkotlinx.coroutines APIリファレンス](https://kotlinlang.org/api/kotlinx.coroutines/)
* [Androidにおけるコルーチンのベストプラクティス](https://developer.android.com/kotlin/coroutines/coroutines-best-practices)
* [KotlinコルーチンとフローのためのAndroid追加リソース](https://developer.android.com/kotlin/coroutines/additional-resources)