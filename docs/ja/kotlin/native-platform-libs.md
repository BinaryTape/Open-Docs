---
title: プラットフォームライブラリ
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

オペレーティングシステムのネイティブサービスへのアクセスを提供するために、Kotlin/Native ディストリビューションには、各ターゲットに固有の構築済みのライブラリセットが含まれています。これらは _platform libraries_ （プラットフォームライブラリ）と呼ばれます。

プラットフォームライブラリのパッケージは、デフォルトで使用可能です。それらを使用するために、追加のリンクオプションを指定する必要はありません。Kotlin/Native コンパイラは、どのプラットフォームライブラリがアクセスされているかを自動的に検出し、必要なものをリンクします。

ただし、コンパイラディストリビューションのプラットフォームライブラリは、ネイティブライブラリへの単なるラッパーおよびバインディングです。つまり、ローカルマシンにネイティブライブラリ自体（`.so`、`.a`、`.dylib`、`.dll`など）をインストールする必要があります。

## POSIX bindings

Kotlin は、Android および iOS を含む、すべての UNIX および Windows ベースのターゲットに対して、POSIX platform library（POSIX プラットフォームライブラリ）を提供します。これらのプラットフォームライブラリには、[POSIX standard](https://en.wikipedia.org/wiki/POSIX)（POSIX 標準）に従うプラットフォームの実装へのバインディングが含まれています。

ライブラリを使用するには、プロジェクトにインポートします。

```kotlin
import platform.posix.*
```

:::note
`platform.posix` の内容は、POSIX 実装のバリエーションにより、プラットフォームによって異なります。

:::

サポートされている各プラットフォームの `posix.def` ファイルの内容は、こちらで確認できます。

* [iOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/ios/posix.def)
* [macOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/osx/posix.def)
* [tvOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/tvos/posix.def)
* [watchOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/watchos/posix.def)
* [Linux](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/linux/posix.def)
* [Windows (MinGW)](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/mingw/posix.def)
* [Android](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/android/posix.def)

POSIX platform library（POSIX プラットフォームライブラリ）は、[WebAssembly](wasm-overview) ターゲットでは使用できません。

## Popular native libraries

Kotlin/Native は、OpenGL、zlib、Foundation など、さまざまなプラットフォームで一般的に使用される、さまざまな一般的なネイティブライブラリのバインディングを提供します。

Apple プラットフォームでは、[Objective-C との相互運用性](native-objc-interop) API を有効にするために、`objc` ライブラリが含まれています。

Kotlin/Native ターゲットで使用可能なネイティブライブラリは、セットアップに応じて、コンパイラディストリビューションで確認できます。

* [スタンドアロンの Kotlin/Native コンパイラをインストールした場合](native-get-started#download-and-install-the-compiler):

  1. コンパイラディストリビューションを含む解凍されたアーカイブ（例：`kotlin-native-prebuilt-macos-aarch64-2.1.0`）に移動します。
  2. `klib/platform` ディレクトリに移動します。
  3. 対応するターゲットのフォルダーを選択します。

* IDE で Kotlin プラグイン（IntelliJ IDEA および Android Studio にバンドル）を使用している場合：

  1. コマンドラインツールで、以下を実行して `.konan` フォルダに移動します。

     <Tabs>
     <TabItem value="macOS and Linux" label="macOS and Linux">

     ```none
     ~/.konan/
     ```

     </TabItem>
     <TabItem value="Windows" label="Windows">

     ```none
     %\USERPROFILE%\.konan
     ```

     </TabItem>
     </Tabs>

  2. Kotlin/Native コンパイラディストリビューション（例：`kotlin-native-prebuilt-macos-aarch64-2.1.0`）を開きます。
  3. `klib/platform` ディレクトリに移動します。
  4. 対応するターゲットのフォルダーを選択します。

:::tip
サポートされている各プラットフォームライブラリの定義ファイルを確認する場合は、コンパイラディストリビューションフォルダで、`konan/platformDef` ディレクトリに移動し、必要なターゲットを選択してください。

:::

## What's next

[Swift/Objective-C との相互運用性の詳細](native-objc-interop)