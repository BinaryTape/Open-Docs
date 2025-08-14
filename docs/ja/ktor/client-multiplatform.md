[//]: # (title: マルチプラットフォーム)

<tldr>
<p>
コード例: <a href="https://github.com/ktorio/ktor-samples/tree/main/client-mpp">client-mpp</a>
</p>
</tldr>

<link-summary>
Ktorクライアントはマルチプラットフォームプロジェクトで使用でき、Android、JavaScript、Nativeプラットフォームをサポートしています。
</link-summary>

[Ktor HTTPクライアント](client-create-and-configure.md)は、[マルチプラットフォームプロジェクト](https://kotlinlang.org/docs/multiplatform.html)で使用でき、以下のプラットフォームをサポートしています:
* JVM
* [Android](https://kotlinlang.org/docs/android-overview.html)
* [JavaScript](https://kotlinlang.org/docs/js-overview.html)
* [Native](https://kotlinlang.org/docs/native-overview.html)

## 依存関係を追加する {id="add-dependencies"}
プロジェクトでKtor HTTPクライアントを使用するには、少なくとも2つの依存関係、つまりクライアント依存関係と[エンジン](client-engines.md)依存関係を追加する必要があります。マルチプラットフォームプロジェクトの場合、これらの依存関係は次のように追加する必要があります:
1. 共通コードでKtorクライアントを使用するには、`build.gradle`または`build.gradle.kts`ファイル内の`commonMain`ソースセットに`ktor-client-core`への依存関係を追加します:
   <var name="platform_name" value="common"/>
   <var name="artifact_name" value="ktor-client-core"/>
   
    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
    </tabs>
    
1. 必要なプラットフォームの[エンジン依存関係](client-engines.md#dependencies)を対応するソースセットに追加します。Androidの場合、`androidMain`ソースセットに[Android](client-engines.md#android)エンジン依存関係を追加できます:
   <var name="platform_name" value="android"/>
   <var name="artifact_name" value="ktor-client-android"/>
   
    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
    </tabs>
    
   
   iOSの場合、`iosMain`に[Darwin](client-engines.md#darwin)エンジン依存関係を追加する必要があります:
   <var name="platform_name" value="ios"/>
   <var name="artifact_name" value="ktor-client-darwin"/>
   
    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
    </tabs>
    
   
   各プラットフォームでサポートされているエンジンを確認するには、[](client-engines.md#dependencies)を参照してください。

## クライアントを作成する {id="create-client"}
マルチプラットフォームプロジェクトでクライアントを作成するには、プロジェクトの[共通コード](https://kotlinlang.org/docs/mpp-discover-project.html#source-sets)内で[HttpClient](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html)コンストラクターを呼び出します:

[object Promise]

このコードスニペットでは、`HttpClient`コンストラクターはエンジンをパラメーターとして受け入れません。クライアントは、[ビルドスクリプトで追加された](#add-dependencies)アーティファクトに応じて、必要なプラットフォームに合ったエンジンを選択します。

特定のプラットフォーム向けにエンジンの設定を調整する必要がある場合、`HttpClient`コンストラクターに、対応するエンジンクラスを引数として渡して、`engine`メソッドを使用してエンジンを構成します。例:
[object Promise]

すべてのエンジンタイプの構成方法については、[](client-engines.md)を参照してください。

## コード例 {id="code-example"}

[mpp/client-mpp](https://github.com/ktorio/ktor-samples/tree/main/client-mpp)プロジェクトでは、マルチプラットフォームアプリケーションでKtorクライアントを使用する方法を示しています。このアプリケーションは以下のプラットフォームで動作します: `Android`、`iOS`、`JavaScript`、および`macosX64`。