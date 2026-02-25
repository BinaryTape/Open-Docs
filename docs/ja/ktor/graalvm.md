[//]: # (title: GraalVM)

[//]: # (title: GraalVM)

<tldr>
<p>
<control>サンプルプロジェクト</control>: <a href="https://github.com/ktorio/ktor-samples/tree/main/graalvm">graalvm</a>
</p>
</tldr>

<web-summary>
Ktor Serverアプリケーションは、異なるプラットフォーム向けのネイティブイメージを作成するためにGraalVMを利用できます。
</web-summary>
<link-summary>
異なるプラットフォームでネイティブイメージを作成するためにGraalVMを使用する方法を学びます。
</link-summary>

Ktor Serverアプリケーションは、さまざまなプラットフォーム向けのネイティブイメージを作成するために[GraalVM](https://graalvm.org)を利用でき、当然ながら、GraalVMが提供する起動時間の短縮やその他の利点を活用できます。

現在、GraalVMを活用したいKtor Serverアプリケーションは、[アプリケーションエンジン](server-engines.md)としてCIOを使用する必要があります。

## GraalVMの準備

GraalVMをインストールし、インストールディレクトリをシステムパスに追加することに加え、すべての依存関係がバンドルされるようにアプリケーションを準備する必要があります。つまり、fat jarを作成する必要があります。

### リフレクションの設定

GraalVMには、Ktorのようにリフレクションを使用するアプリケーションに関する[いくつかの要件](https://www.graalvm.org/22.1/reference-manual/native-image/Reflection/)があります。これには、特定の型情報を含む[JSONファイル](https://github.com/ktorio/ktor-samples/blob/main/graalvm/src/main/resources/META-INF/native-image/reflect-config.json)を提供する必要があります。この設定ファイルは、`native-image`ツールの引数として渡されます。

## `native-image`ツールの実行

fat jarの準備ができたら、残りのステップは`native-image` CLIツールを使用してネイティブイメージを作成することだけです。
これは[Gradleプラグイン](https://graalvm.github.io/native-build-tools/0.9.8/gradle-plugin.html)でも実行できます。
`build.gradle.kts`ファイルの例は[こちら](https://github.com/ktorio/ktor-samples/blob/main/graalvm/build.gradle.kts)で確認できます。
ただし、使用されている依存関係やプロジェクトのパッケージ名などによって、一部のオプションが異なる場合があることに注意してください。

## 生成されたバイナリの実行

シェルスクリプトがエラーなしで実行されると、ネイティブアプリケーションが得られます。サンプルの場合は`graal-server`という名前です。これを実行するとKtor Serverが起動し、`https://0.0.0.0:8080`で応答します。

[//]: # (<tldr>)

[//]: # (<var name="example_name" value="deployment-ktor-plugin"/>)

[//]: # (<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>)

[//]: # (</tldr>)

[//]: # ()
[//]: # (<link-summary>)

[//]: # (Ktor serverアプリケーションは、異なるプラットフォーム向けのネイティブイメージを作成するためにGraalVMを利用できます。)

[//]: # (</link-summary>)

[//]: # ()
[//]: # (Ktor serverアプリケーションは、さまざまなプラットフォーム向けのネイティブイメージを作成するために[GraalVM]&#40;https://graalvm.org&#41;を利用でき、当然ながら、GraalVMが提供する起動時間の短縮やその他の利点を活用できます。[Ktor Gradleプラグイン]&#40;https://github.com/ktorio/ktor-build-plugins&#41;を使用すると、プロジェクトのGraalVMネイティブイメージをビルドできます。)

[//]: # ()
[//]: # (> 現在、GraalVMを活用したいKtor serverアプリケーションは、[アプリケーションエンジン]&#40;Engines.md&#41;としてCIOを使用する必要があります。)

[//]: # ()
[//]: # (## GraalVMの準備)

[//]: # ()
[//]: # (プロジェクトのGraalVMネイティブイメージをビルドする前に、以下の前提条件が満たされていることを確認してください。)

[//]: # (- [GraalVM]&#40;https://www.graalvm.org/docs/getting-started/&#41;と[Native Image]&#40;https://www.graalvm.org/reference-manual/native-image/&#41;がインストールされていること。)

[//]: # (- `GRAALVM_HOME`および`JAVA_HOME`環境変数が設定されていること。)

[//]: # ()
[//]: # (## Ktorプラグインの設定 {id="configure-plugin"})

[//]: # (ネイティブ実行ファイルをビルドするには、まずKtorプラグインを設定する必要があります。)

[//]: # (1. `build.gradle.kts`ファイルを開き、`plugins`ブロックにプラグインを追加します。)

[//]: # (   ```kotlin)

[//]: # (   ```)

[//]: # (   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="5,8-9"})

[//]: # ()
[//]: # (2. [メインアプリケーションクラス]&#40;server-dependencies.xml#create-entry-point&#41;が設定されていることを確認します。)

[//]: # (   ```kotlin)

[//]: # (   ```)

[//]: # (   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="11-13"})

[//]: # ()
[//]: # (3. 必要に応じて、`ktor.nativeImage`エクステンションを使用して生成されるネイティブ実行ファイルの名前を設定できます。)

[//]: # (   ```kotlin)

[//]: # (   ```)

[//]: # (   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="29,48-51"})

[//]: # ()
[//]: # ()
[//]: # (## ネイティブ実行ファイルのビルドと実行 {id="build"})

[//]: # ()
[//]: # (Ktorプラグインによって提供される`buildNativeImage`タスクは、`build/native/nativeCompile`ディレクトリにアプリケーションを含むネイティブ実行ファイルを生成します。)

[//]: # (これを実行するとKtorサーバーが起動し、デフォルトでは`https://0.0.0.0:8080`で応答します。)