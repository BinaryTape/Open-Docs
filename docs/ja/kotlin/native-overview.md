[//]: # (title: Kotlin/Native)

Kotlin/Nativeは、Kotlinコードを仮想マシンなしで実行できるネイティブバイナリにコンパイルするためのテクノロジーです。Kotlin/Nativeは、Kotlinコンパイラ用の[LLVM](https://llvm.org/)ベースのバックエンドと、Kotlin標準ライブラリのネイティブ実装を含んでいます。

## Kotlin/Nativeの利点

Kotlin/Nativeは、主に_仮想マシン_が望ましくない、または利用できない組み込みデバイスやiOSなどのプラットフォーム向けにコンパイルできるように設計されています。これは、追加のランタイムや仮想マシンを必要としない自己完結型のプログラムを生成する必要がある場合に最適です。

コンパイル済みのKotlinコードは、C、C++、Swift、Objective-C、その他の言語で書かれた既存のプロジェクトに簡単に含めることができます。また、既存のネイティブコード、静的または動的なCライブラリ、Swift/Objective-Cフレームワーク、グラフィカルエンジンなど、あらゆるものをKotlin/Nativeから直接使用できます。

<a href="native-get-started.md"><img src="native-get-started-button.svg" width="350" alt="Kotlin/Nativeを始める" style="block"/></a>

## ターゲットプラットフォーム

Kotlin/Nativeは以下のプラットフォームをサポートしています。

*   Linux
*   Windows ([MinGW](https://www.mingw-w64.org/)経由)
*   [Android NDK](https://developer.android.com/ndk)
*   macOS、iOS、tvOS、watchOS向けのAppleターゲット

  > Appleターゲットをコンパイルするには、[Xcode](https://apps.apple.com/us/app/xcode/id497799835)とそのコマンドラインツールをインストールする必要があります。
  >
  {style="note"}

[サポートされているターゲットの完全なリストを参照](native-target-support.md)。

## 相互運用性

Kotlin/Nativeは、異なるオペレーティングシステム向けのネイティブプログラミング言語との双方向の相互運用性をサポートしています。コンパイラは、多くのプラットフォーム向けの実行可能ファイル、静的または動的なCライブラリ、およびSwift/Objective-Cフレームワークを作成できます。

### Cとの相互運用性

Kotlin/Nativeは[Cとの相互運用性](native-c-interop.md)を提供します。既存のCライブラリをKotlinコードから直接使用できます。

詳細については、以下のチュートリアルを完了してください。

*   [C/C++プロジェクト用のCヘッダーを持つダイナミックライブラリの作成](native-dynamic-libraries.md)
*   [C型がKotlinにどのようにマッピングされるかを学ぶ](mapping-primitive-data-types-from-c.md)
*   [C相互運用とlibcurlを使用したネイティブHTTPクライアントの作成](native-app-with-c-and-libcurl.md)

### Swift/Objective-Cとの相互運用性

Kotlin/Nativeは[Objective-Cを介したSwiftとの相互運用性](native-objc-interop.md)を提供します。macOSおよびiOS上のSwift/Objective-CアプリケーションからKotlinコードを直接使用できます。

詳細については、[AppleフレームワークとしてのKotlin/Native](apple-framework.md)チュートリアルを完了してください。

## プラットフォーム間でのコード共有

Kotlin/Nativeは、プロジェクト間でKotlinコードを共有するのに役立つ一連の事前にビルドされた[プラットフォームライブラリ](native-platform-libs.md)を含んでいます。POSIX、gzip、OpenGL、Metal、Foundation、その他多くの人気のあるライブラリおよびAppleフレームワークは、コンパイラパッケージにKotlin/Nativeライブラリとして事前インポートされ、含まれています。

Kotlin/Nativeは、Android、iOS、JVM、Web、ネイティブなど、複数のプラットフォーム間で共通コードを共有するのに役立つ[Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)テクノロジーの一部です。マルチプラットフォームライブラリは、共通のKotlinコードに必要なAPIを提供し、プロジェクトの共有部分をKotlinですべて一箇所に記述できるようにします。

## メモリマネージャ

Kotlin/Nativeは、JVMやGoに似た自動[メモリマネージャ](native-memory-manager.md)を使用しています。独自のトレースガベージコレクタを持ち、Swift/Objective-CのARCとも統合されています。

メモリ消費量はカスタムメモリ割り当て機構によって制御されます。これはメモリ使用量を最適化し、メモリ割り当ての急激な増加を防ぐのに役立ちます。