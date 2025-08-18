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
異なるプラットフォームでネイティブイメージのためにGraalVMを使用する方法を学びましょう。
</link-summary>

Ktorサーバーアプリケーションは、異なるプラットフォーム向けのネイティブイメージを作成するために[GraalVM](https://graalvm.org)を利用でき、もちろん、GraalVMが提供する高速な起動時間やその他の利点を活用できます。

現在、GraalVMを活用したいKtorサーバーアプリケーションは、[アプリケーションエンジン](server-engines.md)としてCIOを使用する必要があります。

## GraalVMの準備

GraalVMをインストールし、システムパスにそのインストールディレクトリを含めることに加えて、すべての依存関係がバンドルされるようにアプリケーションを準備する必要があります。つまり、fat JARを作成する必要があります。

### リフレクションの設定

GraalVMは、リフレクションを使用するアプリケーション（Ktorの場合もこれに該当します）に関して[いくつかの要件](https://www.graalvm.org/22.1/reference-manual/native-image/Reflection/)を持っています。特定の型情報を含む[JSONファイル](https://github.com/ktorio/ktor-samples/blob/main/graalvm/src/main/resources/META-INF/native-image/reflect-config.json)を提供する必要があり、この設定ファイルは`native-image`ツールに引数として渡されます。

## `native-image`ツールの実行

fat JARの準備ができたら、必要な唯一のステップは`native-image` CLIツールを使用してネイティブイメージを作成することです。これは[Gradleプラグイン](https://graalvm.github.io/native-build-tools/0.9.8/gradle-plugin.html)によっても実行できます。`build.gradle.kts`ファイルの例は[こちら](https://github.com/ktorio/ktor-samples/blob/main/graalvm/build.gradle.kts)で確認できます。ただし、使用されている依存関係やプロジェクトのパッケージ名などによって、いくつかのオプションが異なる場合があることにご注意ください。

## 結果のバイナリを実行する

シェルスクリプトがエラーなしで実行された場合、ネイティブアプリケーションが生成されます。サンプルの場合は`graal-server`という名前です。これを実行するとKtorサーバーが起動し、`https://0.0.0.0:8080`で応答します。