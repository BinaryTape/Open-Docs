[//]: # (title: プラットフォームライブラリ)

オペレーティングシステムのネイティブサービスへのアクセスを提供するために、Kotlin/Native 配布物には各ターゲットに固有のビルド済みライブラリのセットが含まれています。これらは *プラットフォームライブラリ* と呼ばれます。

プラットフォームライブラリのパッケージはデフォルトで利用可能です。これらを使用するために追加のリンクオプションを指定する必要はありません。Kotlin/Native コンパイラは、どのプラットフォームライブラリがアクセスされているかを自動的に検出し、必要なものをリンクします。

ただし、コンパイラの配布物に含まれるプラットフォームライブラリは、単なるネイティブライブラリのラッパーおよびバインディングです。つまり、ローカルマシンにネイティブライブラリ自体（`.so`、`.a`、`.dylib`、`.dll` など）をインストールしておく必要があります。

## POSIX バインディング

Kotlin は、Android や iOS を含む、すべての UNIX および Windows ベースのターゲットに対して POSIX プラットフォームライブラリを提供します。
これらのプラットフォームライブラリには、[POSIX 標準](https://en.wikipedia.org/wiki/POSIX)に従ったプラットフォームの実装へのバインディングが含まれています。

このライブラリを使用するには、プロジェクトにインポートします：

```kotlin
import platform.posix.*
```

> POSIX 実装の差異により、`platform.posix` の内容はプラットフォームごとに異なります。
>
{style="note"}

サポートされている各プラットフォームの `posix.def` ファイルの内容は、こちらで確認できます：

* [iOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/ios/posix.def)
* [macOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/osx/posix.def)
* [tvOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/tvos/posix.def)
* [watchOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/watchos/posix.def)
* [Linux](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/linux/posix.def)
* [Windows (MinGW)](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/mingw/posix.def)
* [Android](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/android/posix.def)

POSIX プラットフォームライブラリは、[WebAssembly](wasm-overview.md) ターゲットでは利用できません。

## 一般的なネイティブライブラリ

Kotlin/Native は、OpenGL、zlib、Foundation など、さまざまなプラットフォームで一般的に使用される多くの一般的なネイティブライブラリのバインディングを提供しています。

Apple プラットフォームでは、[Objective-C API との相互運用性](native-objc-interop.md)を有効にするために `objc` ライブラリが含まれています。

セットアップに応じて、コンパイラの配布物に含まれる Kotlin/Native ターゲットで利用可能なネイティブライブラリを確認できます：

* [スタンドアロンの Kotlin/Native コンパイラをインストールした場合](native-get-started.md#download-and-install-the-compiler)：

  1. コンパイラ配布物の解凍先アーカイブ（例：`kotlin-native-prebuilt-macos-aarch64-2.1.0`）に移動します。
  2. `klib/platform` ディレクトリに移動します。
  3. 対応するターゲットのフォルダを選択します。

* IDE（IntelliJ IDEA または Android Studio にバンドル）で Kotlin プラグインを使用している場合：

  1. コマンドラインツールで次を実行し、`.konan` フォルダに移動します：

     <tabs>
     <tab title="macOS および Linux">

     ```none
     ~/.konan/
     ```

     </tab>
     <tab title="Windows">

     ```none
     %\USERPROFILE%\.konan
     ```

     </tab>
     </tabs>

  2. Kotlin/Native コンパイラの配布物（例：`kotlin-native-prebuilt-macos-aarch64-2.1.0`）を開きます。
  3. `klib/platform` ディレクトリに移動します。
  4. 対応するターゲットのフォルダを選択します。

> 各プラットフォームライブラリの定義ファイルを調べたい場合は、コンパイラ配布物フォルダ内の `konan/platformDef` ディレクトリに移動し、必要なターゲットを選択してください。
> 
{style="tip"}

## 次のステップ

[Swift/Objective-C との相互運用性について詳しく学ぶ](native-objc-interop.md)