[//]: # (title: プラットフォームライブラリ)

オペレーティングシステムのネイティブサービスへのアクセスを提供するために、Kotlin/Nativeディストリビューションには、各ターゲットに固有のビルド済みライブラリのセットが含まれています。これらは_プラットフォームライブラリ_と呼ばれます。

プラットフォームライブラリのパッケージはデフォルトで利用可能です。これらを使用するために追加のリンクオプションを指定する必要はありません。Kotlin/Nativeコンパイラは、どのプラットフォームライブラリがアクセスされているかを自動的に検出し、必要なものをリンクします。

しかし、コンパイラディストリビューション内のプラットフォームライブラリは、ネイティブライブラリへの単なるラッパーとバインディングに過ぎません。つまり、ネイティブライブラリ自体（`.so`、`.a`、`.dylib`、`.dll`など）をローカルマシンにインストールする必要があります。

## POSIXバインディング

Kotlinは、AndroidとiOSを含むすべてのUNIXベースおよびWindowsベースのターゲット向けにPOSIXプラットフォームライブラリを提供します。これらのプラットフォームライブラリには、[POSIX標準](https://en.wikipedia.org/wiki/POSIX)に準拠したプラットフォームの実装へのバインディングが含まれています。

ライブラリを使用するには、プロジェクトにインポートします。

```kotlin
import platform.posix.*
```

> `platform.posix`の内容は、POSIXの実装のバリエーションによりプラットフォーム間で異なります。
>
{style="note"}

各サポートされているプラットフォームの`posix.def`ファイルの内容は、以下で確認できます。

* [iOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/ios/posix.def)
* [macOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/osx/posix.def)
* [tvOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/tvos/posix.def)
* [watchOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/watchos/posix.def)
* [Linux](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/linux/posix.def)
* [Windows (MinGW)](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/mingw/posix.def)
* [Android](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/android/posix.def)

POSIXプラットフォームライブラリは、[WebAssembly](wasm-overview.md)ターゲットでは利用できません。

## 主要なネイティブライブラリ

Kotlin/Nativeは、OpenGL、zlib、Foundationなど、様々なプラットフォームで一般的に使用される主要なネイティブライブラリのバインディングを提供します。

Appleプラットフォームでは、Objective-C APIとの[相互運用性](native-objc-interop.md)を可能にするために、`objc`ライブラリが含まれています。

Kotlin/Nativeターゲットで利用可能なネイティブライブラリは、セットアップに応じて、コンパイラディストリビューション内で探索できます。

* [スタンドアロンのKotlin/Nativeコンパイラをインストール](native-get-started.md#download-and-install-the-compiler)した場合：

  1. コンパイラディストリビューションを含む解凍されたアーカイブ（例: `kotlin-native-prebuilt-macos-aarch64-2.1.0`）に移動します。
  2. `klib/platform`ディレクトリに移動します。
  3. 対応するターゲットのフォルダを選択します。

* IDEでKotlinプラグインを使用している場合（IntelliJ IDEAおよびAndroid Studioにバンドルされています）：

  1. コマンドラインツールで、以下のコマンドを実行して`.konan`フォルダに移動します。

     <tabs>
     <tab title="macOSおよびLinux">

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

  2. Kotlin/Nativeコンパイラディストリビューション（例: `kotlin-native-prebuilt-macos-aarch64-2.1.0`）を開きます。
  3. `klib/platform`ディレクトリに移動します。
  4. 対応するターゲットのフォルダを選択します。

> 各サポートされているプラットフォームライブラリの定義ファイルを探索したい場合は、コンパイラディストリビューションフォルダ内で`konan/platformDef`ディレクトリに移動し、必要なターゲットを選択してください。
>
{style="tip"}

## 次のステップ

[Swift/Objective-Cとの相互運用性についてさらに学ぶ](native-objc-interop.md)