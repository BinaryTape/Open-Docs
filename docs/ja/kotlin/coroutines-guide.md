<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: コルーチンガイド)

Kotlinは、他のライブラリがコルーチンを利用できるように、標準ライブラリには最小限の低レベルAPIしか提供していません。同様の機能を備えた他の多くの言語とは異なり、`async`や`await`はKotlinではキーワードではなく、標準ライブラリの一部でもありません。さらに、Kotlinの_サスペンド関数_の概念は、Future (フューチャー) やPromise (プロミス) よりも、非同期処理に対してより安全でエラーになりにくい抽象化を提供します。

`kotlinx.coroutines`は、JetBrainsによって開発されたコルーチンのための豊富なライブラリです。このガイドで取り上げる、`launch`や`async`などの高レベルなコルーチン対応プリミティブを多数含んでいます。

これは、`kotlinx.coroutines`の主要な機能について、一連の例を交え、さまざまなトピックに分けて解説するガイドです。

コルーチンを使用し、このガイドの例に沿って進めるには、[プロジェクトのREADME](https://github.com/Kotlin/kotlinx.coroutines/blob/master/README.md#using-in-your-projects)で説明されているように、`kotlinx-coroutines-core`モジュールへの依存関係を追加する必要があります。

## 目次

*   [コルーチンの基本](coroutines-basics.md)
*   [チュートリアル: コルーチンとチャネルの概要](coroutines-and-channels.md)
*   [キャンセルとタイムアウト](cancellation-and-timeouts.md)
*   [サスペンド関数の構成](composing-suspending-functions.md)
*   [コルーチンコンテキストとディスパッチャ](coroutine-context-and-dispatchers.md)
*   [非同期Flow](flow.md)
*   [チャネル](channels.md)
*   [コルーチンの例外処理](exception-handling.md)
*   [共有可能なミュータブルな状態と並行処理](shared-mutable-state-and-concurrency.md)
*   [Select式 (実験的)](select-expression.md)
*   [チュートリアル: IntelliJ IDEA を使用したコルーチンのデバッグ](debug-coroutines-with-idea.md)
*   [チュートリアル: IntelliJ IDEA を使用したKotlin Flowのデバッグ](debug-flow-with-idea.md)

## その他の参考資料

*   [コルーチンを使ったUIプログラミングガイド](https://github.com/Kotlin/kotlinx.coroutines/blob/master/ui/coroutines-guide-ui.md)
*   [コルーチンの設計ドキュメント (KEEP)](https://github.com/Kotlin/KEEP/blob/master/proposals/coroutines.md)
*   [kotlinx.coroutines APIリファレンス](https://kotlinlang.org/api/kotlinx.coroutines/)
*   [Androidにおけるコルーチンのベストプラクティス](https://developer.android.com/kotlin/coroutines/coroutines-best-practices)
*   [KotlinコルーチンとFlowに関する追加のAndroidリソース](https://developer.android.com/kotlin/coroutines/additional-resources)