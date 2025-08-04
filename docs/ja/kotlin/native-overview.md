[//]: # (title: Kotlin/Native)

Kotlin/Nativeは、Kotlinコードを仮想マシンなしで実行できるネイティブバイナリにコンパイルするためのテクノロジーです。Kotlin/Nativeには、Kotlinコンパイラ用の[LLVM](https://llvm.org/)-ベースのバックエンドと、Kotlin標準ライブラリのネイティブ実装が含まれています。

## Kotlin/Nativeの利点

Kotlin/Nativeは、主に組み込みデバイスやiOSなど、_仮想マシン_が望ましくないまたは不可能なプラットフォーム向けにコンパイルできるように設計されています。追加のランタイムや仮想マシンを必要としない自己完結型プログラムを作成する必要がある場合に最適です。

コンパイルされたKotlinコードを、C、C++、Swift、Objective-C、その他の言語で記述された既存のプロジェクトに簡単に含めることができます。また、既存のネイティブコード、静的または動的Cライブラリ、Swift/Objective-Cフレームワーク、グラフィックエンジンなど、あらゆるものをKotlin/Nativeから直接使用できます。

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

[サポートされているターゲットの全リストを見る](native-target-support.md)。

## 相互運用性

Kotlin/Nativeは、異なるオペレーティングシステム向けのネイティブプログラミング言語との双方向の相互運用性をサポートしています。コンパイラは、多くのプラットフォーム向けの実行可能ファイル、静的または動的Cライブラリ、およびSwift/Objective-Cフレームワークを作成できます。

### Cとの相互運用

Kotlin/Nativeは[Cとの相互運用](native-c-interop.md)を提供します。既存のCライブラリをKotlinコードから直接使用できます。

詳細については、以下のチュートリアルを完了してください。

*   [C/C++プロジェクト向けのCヘッダー付き動的ライブラリを作成する](native-dynamic-libraries.md)
*   [Cの型がKotlinにどのようにマッピングされるかを学ぶ](mapping-primitive-data-types-from-c.md)
*   [C相互運用とlibcurlを使用してネイティブHTTPクライアントを作成する](native-app-with-c-and-libcurl.md)

### Swift/Objective-Cとの相互運用

Kotlin/Nativeは[Objective-Cを介したSwiftとの相互運用](native-objc-interop.md)を提供します。macOSおよびiOS上のSwift/Objective-CアプリケーションからKotlinコードを直接使用できます。

詳細については、[AppleフレームワークとしてのKotlin/Native](apple-framework.md)チュートリアルを完了してください。

## プラットフォーム間でのコード共有

Kotlin/Nativeには、プロジェクト間でKotlinコードを共有するのに役立つ、事前ビルドされた[プラットフォームライブラリ](native-platform-libs.md)のセットが含まれています。POSIX、gzip、OpenGL、Metal、Foundation、その他多くの人気のあるライブラリやAppleフレームワークは、コンパイラパッケージにKotlin/Nativeライブラリとして事前インポートされ、含まれています。

Kotlin/Nativeは、Android、iOS、JVM、Web、ネイティブなど、複数のプラットフォーム間で共通コードを共有するのに役立つ[Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)テクノロジーの一部です。マルチプラットフォームライブラリは、共通のKotlinコードに必要なAPIを提供し、プロジェクトの共有部分をすべてKotlinで一箇所に記述することを可能にします。

## メモリマネージャ

Kotlin/Nativeは、JVMやGoに似た自動[メモリマネージャ](native-memory-manager.md)を使用します。独自のトレース型ガベージコレクタを持ち、Swift/Objective-CのARCとも統合されています。

メモリ消費量はカスタムメモリ割り当て器によって制御されます。これによりメモリ使用量が最適化され、メモリ割り当ての急増を防ぐのに役立ちます。