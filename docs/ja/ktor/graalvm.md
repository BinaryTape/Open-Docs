[//]: # (title: GraalVM)

[//]: # (title: GraalVM)

<tldr>
<p>
<control>サンプルプロジェクト</control>: <a href="https://github.com/ktorio/ktor-samples/tree/main/graalvm">graalvm</a>
</p>
</tldr>

<web-summary>
Ktorサーバーアプリケーションは、異なるプラットフォーム向けのネイティブイメージを作成するためにGraalVMを利用できます。
</web-summary>
<link-summary>
異なるプラットフォームでネイティブイメージにGraalVMを使用する方法を学びましょう。
</link-summary>

Ktorサーバーアプリケーションは、異なるプラットフォーム向けのネイティブイメージを作成するために[GraalVM](https://graalvm.org)を利用でき、もちろんGraalVMが提供する高速な起動時間やその他の利点を享受できます。

現在、GraalVMを活用したいKtorサーバーアプリケーションは、[アプリケーションエンジン](server-engines.md)としてCIOを使用する必要があります。

## GraalVMの準備

GraalVMをインストールし、そのインストールディレクトリをシステムパスに含めることに加えて、すべての依存関係がバンドルされるようにアプリケーションを準備する必要があります。つまり、ファットJARを作成する必要があります。

### リフレクション設定

GraalVMには、リフレクションを使用するアプリケーション（Ktorの場合も同様です）に関して[いくつかの要件](https://www.graalvm.org/22.1/reference-manual/native-image/Reflection/)があります。これには、特定の型情報を含む[JSONファイル](https://github.com/ktorio/ktor-samples/blob/main/graalvm/src/main/resources/META-INF/native-image/reflect-config.json)を提供することが求められます。この設定ファイルは、`native-image`ツールに引数として渡されます。

## `native-image`ツールの実行

ファットJARの準備ができたら、必要な唯一のステップは`native-image` CLIツールを使用してネイティブイメージを作成することです。これは[Gradleプラグイン](https://graalvm.github.io/native-build-tools/0.9.8/gradle-plugin.html)でも可能です。`build.gradle.kts`ファイルの例は[こちら](https://github.com/ktorio/ktor-samples/blob/main/graalvm/build.gradle.kts)で確認できます。ただし、使用する依存関係やプロジェクトのパッケージ名などによって、一部のオプションが異なる場合があることに注意してください。

## 生成されたバイナリの実行

シェルスクリプトがエラーなしで実行された場合、ネイティブアプリケーションが取得できるはずです。サンプルの場合は`graal-server`という名前です。これを実行するとKtorサーバーが起動し、`https://0.0.0.0:8080`で応答します。

[//]: # (<tldr>)

[//]: # (<var name="example_name" value="deployment-ktor-plugin"/>)

[//]: # (<include from="lib.topic" element-id="download_example"/>)

[//]: # (</tldr>)

[//]: # ()
[//]: # (<link-summary>)

[//]: # (Ktorサーバーアプリケーションは、異なるプラットフォーム向けのネイティブイメージを作成するためにGraalVMを利用できます。)

[//]: # (</link-summary>)

[//]: # ()
[//]: # (Ktorサーバーアプリケーションは、異なるプラットフォーム向けのネイティブイメージを作成するために[GraalVM]&#40;https://graalvm.org&#41;を利用でき、もちろんGraalVMが提供する高速な起動時間やその他の利点を享受できます。[Ktor Gradleプラグイン]&#40;https://github.com/ktorio/ktor-build-plugins&#41;を使用すると、プロジェクトのGraalVMネイティブイメージをビルドできます。)

[//]: # ()
[//]: # (> 現在、GraalVMを活用したいKtorサーバーアプリケーションは、[アプリケーションエンジン]&#40;Engines.md&#41;としてCIOを使用する必要があります。)

[//]: # ()
[//]: # (## GraalVMの準備)

[//]: # ()
[//]: # (プロジェクトのGraalVMネイティブイメージをビルドする前に、以下の前提条件が満たされていることを確認してください:)

[//]: # (- [GraalVM]&#40;https://www.graalvm.org/docs/getting-started/&#41;と[Native Image]&#40;https://www.graalvm.org/reference-manual/native-image/&#41;がインストールされていること。)

[//]: # (- GRAALVM_HOMEおよびJAVA_HOME環境変数が設定されていること。)

[//]: # ()
[//]: # (## Ktorプラグインの設定 {id="configure-plugin"})

[//]: # (ネイティブ実行可能ファイルをビルドするには、まずKtorプラグインを設定する必要があります。)

[//]: # (1. `build.gradle.kts`ファイルを開き、`plugins`ブロックにプラグインを追加します:)

[//]: # (   ```kotlin)

[//]: # (   ```)

[//]: # (   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="5,8-9"})

[//]: # ()
[//]: # (2. [メインアプリケーションクラス]&#40;server-dependencies.xml#create-entry-point&#41;が設定されていることを確認します:)

[//]: # (   ```kotlin)

[//]: # (   ```)

[//]: # (   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="11-13"})

[//]: # ()
[//]: # (3. オプションで、`ktor.nativeImage`拡張を使用して生成されるネイティブ実行可能ファイルの名前を設定できます:)

[//]: # (   ```kotlin)

[//]: # (   ```)

[//]: # (   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="29,48-51"})

[//]: # ()
[//]: # ()
[//]: # (## ネイティブ実行可能ファイルのビルドと実行 {id="build"})

[//]: # ()
[//]: # (Ktorプラグインが提供する`buildNativeImage`タスクは、`build/native/nativeCompile`ディレクトリにアプリケーションのネイティブ実行可能ファイルを生成します。)

[//]: # (これを実行するとKtorサーバーが起動し、デフォルトで`https://0.0.0.0:8080`で応答します。)