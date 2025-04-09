---
title: "最終的なネイティブバイナリを構築する（実験的 DSL）"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<no-index/>
:::note
下記で説明する新しい DSL は[Experimental](components-stability)です。予告なく変更される場合があります。
評価目的での使用を推奨します。

新しい DSL がうまくいかない場合は、ネイティブバイナリをビルドするための[以前のアプローチ](multiplatform-build-native-binaries)を参照してください。

[Kotlin/Native targets](multiplatform-dsl-reference#native-targets)は、`*.klib`ライブラリの成果物にコンパイルされます。
これは依存関係として Kotlin/Native 自体で使用できますが、ネイティブライブラリとしては使用できません。
 
最終的なネイティブバイナリを宣言するには、新しいバイナリ形式を`kotlinArtifacts` DSL で使用します。これは、デフォルトの`*.klib`成果物に加えて、このターゲット用にビルドされたネイティブバイナリのコレクションを表し、それらを宣言および構成するための一連のメソッドを提供します。
 
`kotlin-multiplatform`プラグインは、デフォルトでは本番バイナリを作成しません。デフォルトで使用できる唯一のバイナリは、`test`コンパイルから単体テストを実行できるデバッグテスト実行可能ファイルです。

:::

Kotlin artifact DSL は、アプリから複数の Kotlin モジュールにアクセスする必要がある場合によくある問題を解決するのに役立ちます。
複数の Kotlin/Native 成果物の使用は制限されているため、新しい DSL を使用して複数の Kotlin モジュールを 1 つの成果物にエクスポートできます。

## バイナリの宣言

`kotlinArtifacts {}`は、Gradle ビルドスクリプトの成果物構成用のトップレベルブロックです。`kotlinArtifacts {}` DSL の要素を宣言するには、次の種類のバイナリを使用します。

| ファクトリメソッド | バイナリの種類                                                                               | 利用可能なターゲット                                |
|----------------|-------------------------------------------------------------------------------------------|----------------------------------------------|
| `sharedLib`    | [共有ネイティブライブラリ](native-faq#how-do-i-create-a-shared-library)                   | `WebAssembly` を除くすべてのネイティブターゲット |
| `staticLib`    | [静的ネイティブライブラリ](native-faq#how-do-i-create-a-static-library-or-an-object-file) | `WebAssembly` を除くすべてのネイティブターゲット |
| `framework`    | Objective-C framework                                                                     | macOS、iOS、watchOS、tvOS ターゲットのみ   |
| `fatFramework` | Universal fat framework                                                                   | macOS、iOS、watchOS、tvOS ターゲットのみ   |
| `XCFramework`  | XCFramework framework                                                                     | macOS、iOS、watchOS、tvOS ターゲットのみ   |

`kotlinArtifacts`要素内には、次のブロックを記述できます。

* [Native.Library](#library)
* [Native.Framework](#framework)
* [Native.FatFramework](#fat-frameworks)
* [Native.XCFramework](#xcframeworks)

最もシンプルなバージョンでは、選択したビルドタイプの `target` (または `targets`) パラメータが必要です。現在、
次の 2 種類のビルドタイプを使用できます。

* `DEBUG` – デバッグ情報を含む最適化されていないバイナリを生成します。
* `RELEASE` – デバッグ情報を含まない最適化されたバイナリを生成します。

`modes`パラメータでは、バイナリを作成するビルドタイプを指定できます。デフォルト値には、`DEBUG`と`RELEASE`の両方の実行可能バイナリが含まれます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlinArtifacts {
    Native.Library {
        target = iosX64 // ターゲットを定義してください
        modes(DEBUG, RELEASE)
        // バイナリ構成
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlinArtifacts {
    it.native.Library {
        target = iosX64 // ターゲットを定義してください
        modes(DEBUG, RELEASE)
        // バイナリ構成
    }
}
```

</TabItem>
</Tabs>

カスタム名でバイナリを宣言することもできます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlinArtifacts {
    Native.Library("mylib") {
        // バイナリ構成
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlinArtifacts {
    it.native.Library("mylib") {
        // バイナリ構成
    }
}
```

</TabItem>
</Tabs>

引数は、バイナリファイルのデフォルト名である名前プレフィックスを設定します。たとえば、Windows の場合、このコードは `mylib.dll` ファイルを生成します。

## バイナリの構成

バイナリ構成には、次の共通パラメータを使用できます。

| **名前**        | **説明**                                                                                                                                        |
|-----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| `isStatic`      | ライブラリタイプを定義するオプションのリンキングタイプ。デフォルトでは、`false` でライブラリは動的です。                                              |
| `modes`         | オプションのビルドタイプ。`DEBUG` と `RELEASE`。                                                                                                           |
| `kotlinOptions` | コンパイルに適用されるオプションのコンパイラオプション。[利用可能なコンパイラオプション](gradle-compiler-options)のリストを参照してください。                        |
| `addModule`     | 現在のモジュールに加えて、他のモジュールも結果の成果物に追加できます。                                                                |
| `setModules`    | 結果の成果物に追加されるすべてのモジュールのリストをオーバーライドできます。                                                                 |
| `target`        | プロジェクトの特定のターゲットを宣言します。[ターゲット](multiplatform-dsl-reference#targets)セクションに、利用可能なターゲットの名前が一覧表示されています。 |

### ライブラリとフレームワーク

Objective-C framework またはネイティブライブラリ (共有または静的) をビルドする場合、現在のプロジェクトのクラスだけでなく、他のマルチプラットフォームモジュールのクラスも単一のエンティティにパックし、これらすべてのモジュールをエクスポートする必要がある場合があります。

#### Library

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlinArtifacts {
    Native.Library("myslib") {
        target = linuxX64
        isStatic = false
        modes(DEBUG)
        addModule(project(":lib"))
        kotlinOptions {
            verbose = false
            freeCompilerArgs += "-Xmen=pool"
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlinArtifacts {
    it.native.Library("myslib") {
        target = linuxX64
        it.static = false
        modes(DEBUG)
        addModule(project(":lib"))
        kotlinOptions {
            verbose = false
            freeCompilerArgs += "-Xmen=pool"
        }
    }
}
```

</TabItem>
</Tabs>

登録された Gradle タスクは `assembleMyslibSharedLibrary` であり、登録されたすべてのタイプの「myslib」を動的ライブラリにアセンブルします。

#### Framework

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlinArtifacts {
    Native.Framework("myframe") {
        modes(DEBUG, RELEASE)
        target = iosArm64
        isStatic = false
        kotlinOptions {
            verbose = false
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlinArtifacts {
    it.native.Framework("myframe") {
        modes(DEBUG, RELEASE)
        target = iosArm64
        it.static = false
        kotlinOptions {
            verbose = false
        }
    }
}
```

</TabItem>
</Tabs>

登録された Gradle タスクは `assembleMyframeFramework` であり、登録されたすべてのタイプの「myframe」framework をアセンブルします。

:::tip
何らかの理由で新しい DSL がうまくいかない場合は、バイナリに依存関係をエクスポートするための[以前のアプローチ](multiplatform-build-native-binaries#export-dependencies-to-binaries)を試してください。

:::

### Fat frameworks

デフォルトでは、Kotlin/Native によって生成された Objective-C framework は 1 つのプラットフォームのみをサポートします。ただし、このような framework を 1 つのユニバーサル (fat) バイナリにマージできます。これは特に、32 ビットおよび 64 ビットの iOS framework にとって理にかなっています。
この場合、結果のユニバーサル framework を 32 ビットと 64 ビットの両方のデバイスで使用できます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlinArtifacts {
    Native.FatFramework("myfatframe") {
        targets(iosX32, iosX64)
        kotlinOptions {
            suppressWarnings = false
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlinArtifacts {
    it.native.FatFramework("myfatframe") {
        targets(iosX32, iosX64)
        kotlinOptions {
            suppressWarnings = false
        }
    }
}
```

</TabItem>
</Tabs>

登録された Gradle タスクは `assembleMyfatframeFatFramework` であり、登録されたすべてのタイプの「myfatframe」fat framework をアセンブルします。

:::tip
何らかの理由で新しい DSL がうまくいかない場合は、fat framework をビルドするための[以前のアプローチ](multiplatform-build-native-binaries#build-universal-frameworks)を試してください。

:::

### XCFrameworks

すべての Kotlin Multiplatform プロジェクトは、XCFrameworks を出力として使用して、すべてのターゲットプラットフォームと
アーキテクチャのロジックを 1 つのバンドルに収集できます。[ユニバーサル (fat) frameworks](#fat-frameworks)とは異なり、App Store にアプリケーションを公開する前に、不要なアーキテクチャをすべて削除する必要はありません。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlinArtifacts {
    Native.XCFramework("sdk") {
        targets(iosX64, iosArm64, iosSimulatorArm64)
        setModules(
            project(":shared"),
            project(":lib")
        )
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlinArtifacts {
    it.native.XCFramework("sdk") {
        targets(iosX64, iosArm64, iosSimulatorArm64)
        setModules(
            project(":shared"), 
            project(":lib")
        )
    }
}
```

</TabItem>
</Tabs>

登録された Gradle タスクは `assembleSdkXCFramework` であり、登録されたすべてのタイプの「sdk」XCFrameworks をアセンブルします。

:::tip
何らかの理由で新しい DSL がうまくいかない場合は、XCFrameworks をビルドするための[以前のアプローチ](multiplatform-build-native-binaries#build-xcframeworks)を試してください。

:::