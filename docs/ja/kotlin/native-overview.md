[//]: # (title: Kotlin/Native)

Kotlin/Nativeは、仮想マシンなしで実行可能なネイティブバイナリにKotlinコードをコンパイルするためのテクノロジーです。
Kotlin/Nativeには、[LLVM](https://llvm.org/)ベースのKotlinコンパイラ用バックエンドと、Kotlin標準ライブラリのネイティブ実装が含まれています。

## なぜKotlin/Nativeなのか？

Kotlin/Nativeは、主に、組み込みデバイスやiOSのように、仮想マシンが望ましくない、あるいは不可能なプラットフォーム向けにコンパイルできるように設計されています。追加のランタイムや仮想マシンを必要としない、自己完結型（self-contained）のプログラムを作成する必要がある状況に最適です。

コンパイルされたKotlinコードを、C、C++、Swift、Objective-C、およびその他の言語で書かれた既存のプロジェクトに含めるのは簡単です。また、既存のネイティブコード、静的または動的Cライブラリ、Swift/Objective-Cフレームワーク、グラフィカルエンジン、その他あらゆるものをKotlin/Nativeから直接使用することもできます。

<a href="native-get-started.md"><img src="native-get-started-button.svg" width="350" alt="Get started with Kotlin/Native" style="block"/></a>

## ターゲットプラットフォーム

Kotlin/Nativeは以下のプラットフォームをサポートしています：

* Linux
* Windows ([MinGW](https://www.mingw-w64.org/)経由)
* [Android NDK](https://developer.android.com/ndk)
* macOS、iOS、tvOS、およびwatchOS用のAppleターゲット

  > Appleターゲットをコンパイルするには、[Xcode](https://apps.apple.com/us/app/xcode/id497799835)とそのコマンドラインツールをインストールする必要があります。
  >
  {style="note"}

[サポートされているターゲットとホストの全リストを表示する](native-target-support.md)。

## 相互運用性（Interoperability）

Kotlin/Nativeは、さまざまなオペレーティングシステムのネイティブプログラミング言語との双方向の相互運用性をサポートしています。コンパイラは、多くのプラットフォーム向けの実行ファイル、静的または動的Cライブラリ、およびSwift/Objective-Cフレームワークを作成できます。

### Cとの相互運用性

Kotlin/Nativeは[Cとの相互運用性](native-c-interop.md)を提供します。既存のCライブラリをKotlinコードから直接使用できます。

詳細については、以下のチュートリアルを完了してください：

* [C/C++プロジェクト用のCヘッダーを持つ動的ライブラリを作成する](native-dynamic-libraries.md)
* [Cの型がKotlinにどのようにマッピングされるかを学ぶ](mapping-primitive-data-types-from-c.md)
* [C相互運用とlibcurlを使用してネイティブHTTPクライアントを作成する](native-app-with-c-and-libcurl.md)

### Swift/Objective-Cとの相互運用性

Kotlin/Nativeは、[Objective-Cを介したSwiftとの相互運用性](native-objc-interop.md)を提供します。macOSおよびiOS上のSwift/Objective-CアプリケーションからKotlinコードを直接使用できます。

詳細については、[AppleフレームワークとしてのKotlin/Native](apple-framework.md)チュートリアルを確認してください。

## プラットフォーム間でのコード共有

Kotlin/Nativeには、プロジェクト間でKotlinコードを共有するのに役立つ、ビルド済みの[プラットフォームライブラリ](native-platform-libs.md)のセットが含まれています。POSIX、gzip、OpenGL、Metal、Foundation、およびその他多くの一般的なライブラリやAppleフレームワークが事前にインポートされ、Kotlin/Nativeライブラリとしてコンパイラパッケージに含まれています。

Kotlin/Nativeは、Android、iOS、JVM、Web、およびネイティブを含む複数のプラットフォーム間で共通コードを共有するのに役立つ[Kotlinマルチプラットフォーム](https://kotlinlang.org/docs/multiplatform/get-started.html)テクノロジーの一部です。マルチプラットフォームライブラリは、共通のKotlinコードに必要なAPIを提供し、プロジェクトの共有部分をすべて1か所でKotlinを使って記述することを可能にします。

## メモリマネージャ

Kotlin/Nativeは、JVMやGoに似た自動[メモリマネージャ](native-memory-manager.md)を使用しています。独自のトレーシングガベージコレクタを備えており、これはSwift/Objective-CのARCとも統合されています。

メモリ消費はカスタムメモリアロケータによって制御されます。これによりメモリ使用量が最適化され、メモリ割り当ての急激な増加を防ぐことができます。