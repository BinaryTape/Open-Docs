[//]: # (title: GraalVM)

[//]: # (title: GraalVM)

<tldr>
<p>
<control>サンプルプロジェクト</control>: <a href="https://github.com/ktorio/ktor-samples/tree/main/graalvm">graalvm</a>
</p>
</tldr>

<web-summary>
Ktorサーバーアプリケーションは、GraalVMを利用してさまざまなプラットフォーム向けにネイティブイメージを作成できます。
</web-summary>
<link-summary>
さまざまなプラットフォームでネイティブイメージにGraalVMを使用する方法を学びましょう。
</link-summary>

Ktorサーバーアプリケーションは、[GraalVM](https://graalvm.org)を利用してさまざまなプラットフォーム向けにネイティブイメージを作成でき、もちろん、GraalVMが提供する高速な起動時間やその他のメリットを活用できます。

現在、GraalVMを活用したいKtorサーバーアプリケーションは、[アプリケーションエンジン](server-engines.md)としてCIOを使用する必要があります。

## GraalVMの準備

GraalVMをインストールし、そのインストールディレクトリをシステムパスに含めることに加えて、すべての依存関係がバンドルされるようにアプリケーションを準備する必要があります。つまり、fat jarを作成する必要があります。

### リフレクション設定

GraalVMには、リフレクションを使用するアプリケーションに関する[いくつかの要件](https://www.graalvm.org/22.1/reference-manual/native-image/Reflection/)があり、Ktorもこれに該当します。特定の型情報を含む[JSONファイル](https://github.com/ktorio/ktor-samples/blob/main/graalvm/src/main/resources/META-INF/native-image/reflect-config.json)を提供する必要があります。この設定ファイルは、その後`native-image`ツールへの引数として渡されます。

## `native-image`ツールの実行

fat jarの準備ができたら、`native-image` CLIツールを使用してネイティブイメージを作成するだけです。これは[Gradleプラグイン](https://graalvm.github.io/native-build-tools/0.9.8/gradle-plugin.html)を使用しても可能です。`build.gradle.kts`ファイルの例は[こちら](https://github.com/ktorio/ktor-samples/blob/main/graalvm/build.gradle.kts)で確認できます。ただし、一部のオプションは、使用されている依存関係やプロジェクトのパッケージ名などによって異なる場合があることに注意してください。

## 結果のバイナリを実行する

シェルスクリプトがエラーなく実行された場合、ネイティブアプリケーションが生成されます。サンプルの場合は`graal-server`という名前です。これを実行するとKtorサーバーが起動し、`https://0.0.0.0:8080`で応答します。