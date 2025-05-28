[//]: # (title: マルチプラットフォーム)

<tldr>
<p>
コード例: <a href="https://github.com/ktorio/ktor-samples/tree/main/client-mpp">client-mpp</a>
</p>
</tldr>

<link-summary>
Ktorクライアントはマルチプラットフォームプロジェクトで使用でき、Android、JavaScript、およびNativeプラットフォームをサポートしています。
</link-summary>

[Ktor HTTPクライアント](client-create-and-configure.md)は[マルチプラットフォームプロジェクト](https://kotlinlang.org/docs/multiplatform.html)で使用でき、以下のプラットフォームをサポートしています:
* JVM
* [Android](https://kotlinlang.org/docs/android-overview.html)
* [JavaScript](https://kotlinlang.org/docs/js-overview.html)
* [Native](https://kotlinlang.org/docs/native-overview.html)

## 依存関係の追加 {id="add-dependencies"}
プロジェクトでKtor HTTPクライアントを使用するには、少なくとも2つの依存関係、つまりクライアントの依存関係と[エンジン](client-engines.md)の依存関係を追加する必要があります。マルチプラットフォームプロジェクトでは、これらの依存関係を次のように追加します:
1.  共通コードでKtorクライアントを使用するには、`build.gradle` または `build.gradle.kts` ファイルの `commonMain` ソースセットに `ktor-client-core` の依存関係を追加します:
    <var name="platform_name" value="common"/>
    <var name="artifact_name" value="ktor-client-core"/>
    <include from="lib.topic" element-id="add_ktor_artifact_multiplatform"/>
1.  対応するソースセットに必要なプラットフォームの[エンジン依存関係](client-engines.md#dependencies)を追加します。Androidの場合、`androidMain` ソースセットに[Android](client-engines.md#android)エンジンの依存関係を追加できます:
    <var name="platform_name" value="android"/>
    <var name="artifact_name" value="ktor-client-android"/>
    <include from="lib.topic" element-id="add_ktor_artifact_multiplatform"/>
    
    iOSの場合、`iosMain` に[Darwin](client-engines.md#darwin)エンジンの依存関係を追加する必要があります:
    <var name="platform_name" value="ios"/>
    <var name="artifact_name" value="ktor-client-darwin"/>
    <include from="lib.topic" element-id="add_ktor_artifact_multiplatform"/>
    
    各プラットフォームでサポートされているエンジンを確認するには、[](client-engines.md#dependencies)を参照してください。

## クライアントの作成 {id="create-client"}
マルチプラットフォームプロジェクトでクライアントを作成するには、プロジェクトの[共通コード](https://kotlinlang.org/docs/mpp-discover-project.html#source-sets)で[HttpClient](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html)コンストラクタを呼び出します:

```kotlin
```
{src="snippets/_misc_client/DefaultEngineCreate.kt"}

このコードスニペットでは、`HttpClient`コンストラクタはエンジンをパラメータとして受け入れません。クライアントは、[ビルドスクリプトに追加された](#add-dependencies)アーティファクトに応じて、必要なプラットフォームのエンジンを選択します。

特定のプラットフォームのエンジン構成を調整する必要がある場合は、対応するエンジンクラスを `HttpClient` コンストラクタへの引数として渡し、`engine` メソッドを使用してエンジンを設定します。例:
```kotlin
```
{src="snippets/_misc_client/AndroidConfig.kt" interpolate-variables="true" disable-links="false"}

すべてのエンジンタイプの構成方法については、[](client-engines.md)で確認できます。

## コード例 {id="code-example"}

[mpp/client-mpp](https://github.com/ktorio/ktor-samples/tree/main/client-mpp)プロジェクトは、マルチプラットフォームアプリケーションでKtorクライアントを使用する方法を示しています。このアプリケーションは、`Android`、`iOS`、`JavaScript`、および `macosX64` の各プラットフォームで動作します。