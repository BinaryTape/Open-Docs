---
title: "Kotlin Native"
---
Kotlin/Nativeは、Kotlinコードを仮想マシンなしで実行できるネイティブバイナリにコンパイルするための技術です。
Kotlin/Nativeには、Kotlinコンパイラー用の[LLVM](https://llvm.org/)-basedバックエンドと、Kotlin標準ライブラリのネイティブ実装が含まれています。

## Kotlin/Nativeを選ぶ理由

Kotlin/Nativeは主に、組み込みデバイスやiOSなど、_仮想マシン_が望ましくない、または不可能なプラットフォーム向けにコンパイルできるように設計されています。
追加のランタイムや仮想マシンを必要としない、自己完結型のプログラムを開発者が作成する必要がある場合に最適です。

## 対象プラットフォーム

Kotlin/Nativeは、次のプラットフォームをサポートしています。
* macOS
* iOS, tvOS, watchOS
* Linux
* Windows (MinGW)
* Android NDK

:::note
Appleターゲット（macOS、iOS、tvOS、watchOS）をコンパイルするには、[Xcode](https://apps.apple.com/us/app/xcode/id497799835)とそのコマンドラインツールがインストールされている必要があります。

:::

[サポートされているターゲットの全リストはこちら](native-target-support)。

## 相互運用性

Kotlin/Nativeは、さまざまなオペレーティングシステム向けのネイティブプログラミング言語との双方向の相互運用性をサポートしています。
コンパイラーは以下を作成します。
* 多くの[プラットフォーム](#target-platforms)向けの実行可能ファイル
* C/C++プロジェクト用のCヘッダーを含む、スタティックライブラリまたは[dynamic](native-dynamic-libraries)ライブラリ
* SwiftおよびObjective-Cプロジェクト用の[Apple framework](apple-framework)

Kotlin/Nativeは、Kotlin/Nativeから既存のライブラリを直接使用するための相互運用性をサポートしています。
* スタティックまたはダイナミック[C libraries](native-c-interop)
* C、[Swift, and Objective-C](native-objc-interop) frameworks

コンパイルされたKotlinコードを、C、C++、Swift、Objective-C、その他の言語で記述された既存のプロジェクトに含めるのは簡単です。
既存のネイティブコード、スタティックまたはダイナミック[C libraries](native-c-interop)、Swift/Objective-C [frameworks](native-objc-interop)、グラフィカルエンジンなども、Kotlin/Nativeから直接簡単に使用できます。

Kotlin/Native [platform libraries](native-platform-libs)は、プロジェクト間でKotlinコードを共有するのに役立ちます。
POSIX、gzip、OpenGL、Metal、Foundation、その他多くの一般的なライブラリとApple frameworksは、プリインポートされ、コンパイラーパッケージにKotlin/Nativeライブラリとして含まれています。

## プラットフォーム間でのコードの共有

[Kotlin Multiplatform](multiplatform-intro)は、Android、iOS、JVM、web、ネイティブを含む複数のプラットフォーム間で共通のコードを共有するのに役立ちます。 Multiplatformライブラリは、共通のKotlinコードに必要なAPIを提供し、プロジェクトの共有部分をすべて1か所でKotlinで記述できるようにします。

[Create your Kotlin Multiplatform app](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)チュートリアルを使用して、アプリケーションを作成し、iOSとAndroidの間でビジネスロジックを共有できます。 iOS、Android、デスクトップ、およびWeb間でUIを共有するには、[Compose Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-create-first-app.html)のチュートリアルを完了してください。これは、Kotlinと[Jetpack Compose](https://developer.android.com/jetpack/compose)に基づくJetBrainsの宣言型UIフレームワークです。

## はじめに

Kotlinは初めてですか？ [Getting started with Kotlin](getting-started)をご覧ください。

推奨ドキュメント：

* [Introduction to Kotlin Multiplatform](multiplatform-intro)
* [Interoperability with C](native-c-interop)
* [Interoperability with Swift/Objective-C](native-objc-interop)

推奨チュートリアル：

* [Get started with Kotlin/Native](native-get-started)
* [Create your Kotlin Multiplatform app](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)
* [Mapping primitive data types from C](mapping-primitive-data-types-from-c)
* [Kotlin/Native as a dynamic Library](native-dynamic-libraries)
* [Kotlin/Native as an Apple framework](apple-framework)