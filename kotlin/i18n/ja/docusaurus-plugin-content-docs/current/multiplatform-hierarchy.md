---
title: 階層的なプロジェクト構造
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin Multiplatformプロジェクトは、階層的なソースセット構造をサポートしています。
つまり、すべてではなく一部の[サポートされているターゲット](multiplatform-dsl-reference#targets)間で共通のコードを共有するために、中間ソースセットの階層を配置できます。中間ソースセットを使用すると、次のことが容易になります。

* 一部のターゲットに特定のAPIを提供します。たとえば、ライブラリはKotlin/Nativeターゲット用の中間ソースセットにネイティブ固有のAPIを追加できますが、Kotlin/JVMターゲットには追加できません。
* 一部のターゲットに特定のAPIを利用します。たとえば、Kotlin Multiplatformライブラリが中間ソースセットを形成する一部のターゲットに提供する豊富なAPIを利用できます。
* プロジェクトでプラットフォーム依存のライブラリを使用します。たとえば、中間iOSソースセットからiOS固有の依存関係にアクセスできます。

Kotlinツールチェーンは、各ソースセットが、そのソースセットのコンパイル対象となるすべてのターゲットで利用可能なAPIのみにアクセスできるようにします。これにより、Windows固有のAPIを使用してからmacOSにコンパイルし、ランタイム時にリンケージエラーや未定義の動作が発生するようなケースを防ぎます。

ソースセットの階層を設定する推奨される方法は、[デフォルトの階層テンプレート](#default-hierarchy-template)を使用することです。このテンプレートは、最も一般的なケースをカバーしています。より高度なプロジェクトがある場合は、[手動で構成する](#manual-configuration)ことができます。これはより低レベルのアプローチです。より柔軟性がありますが、より多くの労力と知識が必要です。

## デフォルトの階層テンプレート

Kotlin Gradleプラグインには、組み込みのデフォルト[階層テンプレート](#see-the-full-hierarchy-template)があります。これには、一般的なユースケース向けにあらかじめ定義された中間ソースセットが含まれています。プラグインは、プロジェクトで指定されたターゲットに基づいて、これらのソースセットを自動的に設定します。

共有コードを含むプロジェクトのモジュールにある、次の`build.gradle(.kts)`ファイルを検討してください。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()
}
```

</TabItem>
</Tabs>

コード内でターゲット`androidTarget`、`iosArm64`、および`iosSimulatorArm64`を宣言すると、Kotlin Gradleプラグインはテンプレートから適切な共有ソースセットを見つけ出し、それらを作成します。結果として得られる階層は次のようになります。

<img src="/img/default-hierarchy-example.svg" alt="デフォルトの階層テンプレートの使用例" style={{verticalAlign: 'middle'}}/>

色付きのソースセットは実際に作成され、プロジェクトに存在しますが、デフォルトのテンプレートからの灰色のソースセットは無視されます。たとえば、プロジェクトにwatchOSターゲットがないため、Kotlin Gradleプラグインは`watchos`ソースセットを作成していません。

`watchosArm64`のようなwatchOSターゲットを追加すると、`watchos`ソースセットが作成され、`apple`、`native`、および`common`ソースセットからのコードも`watchosArm64`にコンパイルされます。

Kotlin Gradleプラグインは、デフォルトの階層テンプレートのすべてのソースセットに対してタイプセーフで静的なアクセサーを提供するため、[手動構成](#manual-configuration)と比較して、`by getting`または`by creating`構造なしでそれらを参照できます。

対応するターゲットを最初に宣言せずに、共有モジュールの`build.gradle(.kts)`ファイルでソースセットにアクセスしようとすると、次の警告が表示されます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        iosMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1")
        }
        // Warning: accessing source set without declaring the target
        linuxX64Main { }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        iosMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1'
            }
        }
        // Warning: accessing source set without declaring the target
        linuxX64Main { }
    }
}
```

</TabItem>
</Tabs>

:::note
この例では、`apple`および`native`ソースセットは`iosArm64`および`iosSimulatorArm64`ターゲットにのみコンパイルされます。
名前にもかかわらず、完全なiOS APIにアクセスできます。
`native`のようなソースセットでは、すべてのネイティブターゲットで利用可能なAPIのみがこのソースセットでアクセス可能であると予想される可能性があるため、これは直感的ではないかもしれません。この動作は将来変更される可能性があります。

:::

### 追加の設定

デフォルトの階層テンプレートを調整する必要がある場合があります。以前に`dependsOn`呼び出しで[手動で](#manual-configuration)中間ソースを導入した場合、デフォルトの階層テンプレートの使用はキャンセルされ、次の警告が表示されます。

```none
The Default Kotlin Hierarchy Template was not applied to '<project-name>':
Explicit .dependsOn() edges were configured for the following source sets:
[<... names of the source sets with manually configured dependsOn-edges...>]

Consider removing dependsOn-calls or disabling the default template by adding
    'kotlin.mpp.applyDefaultHierarchyTemplate=false'
to your gradle.properties

Learn more about hierarchy templates: https://kotl.in/hierarchy-template
```

この問題を解決するには、次のいずれかを実行してプロジェクトを構成します。

* [手動構成をデフォルトの階層テンプレートに置き換える](#replacing-a-manual-configuration)
* [デフォルトの階層テンプレートに追加のソースセットを作成する](#creating-additional-source-sets)
* [デフォルトの階層テンプレートによって作成されたソースセットを変更する](#modifying-source-sets)

#### 手動構成を置き換える

**ケース**。すべての中間ソースセットが現在、デフォルトの階層テンプレートでカバーされています。

**解決策**。共有モジュールの`build.gradle(.kts)`ファイルで、手動によるすべての`dependsOn()`呼び出しと、`by creating`コンストラクションを持つソースセットを削除します。すべてのデフォルトソースセットのリストを確認するには、[完全な階層テンプレート](#see-the-full-hierarchy-template)を参照してください。

#### 追加のソースセットを作成する

**ケース**。デフォルトの階層テンプレートがまだ提供していないソースセットを追加したい場合。
たとえば、macOSターゲットとJVMターゲットの間に追加したいとします。

**解決策**:

1. 共有モジュールの`build.gradle(.kts)`ファイルで、`applyDefaultHierarchyTemplate()`を明示的に呼び出して、テンプレートを再適用します。
2. `dependsOn()`を使用して、[手動で](#manual-configuration)追加のソースセットを構成します。

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

    ```kotlin
    kotlin {
        jvm()
        macosArm64()
        iosArm64()
        iosSimulatorArm64()
    
        // Apply the default hierarchy again. It'll create, for example, the iosMain source set:
        applyDefaultHierarchyTemplate()
    
        sourceSets {
            // Create an additional jvmAndMacos source set:
            val jvmAndMacos by creating {
                dependsOn(commonMain.get())
            }
    
            macosArm64Main.get().dependsOn(jvmAndMacos)
            jvmMain.get().dependsOn(jvmAndMacos)
        }
    }
    ```

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>

    ```groovy
    kotlin {
        jvm()
        macosArm64()
        iosArm64()
        iosSimulatorArm64()
    
        // Apply the default hierarchy again. It'll create, for example, the iosMain source set:
        applyDefaultHierarchyTemplate()
    
        sourceSets {
            // Create an additional jvmAndMacos source set:
            jvmAndMacos {
                dependsOn(commonMain.get())
            }
            macosArm64Main {
                dependsOn(jvmAndMacos.get())
            }
            jvmMain {
                dependsOn(jvmAndMacos.get())
            }
        } 
    }
    ```

    </TabItem>
    </Tabs>

#### ソースセットを変更する

**ケース**。テンプレートによって生成されたものとまったく同じ名前のソースセットがすでに存在しますが、プロジェクト内の異なるターゲットセット間で共有されています。たとえば、`nativeMain`ソースセットは、デスクトップ固有のターゲット（`linuxX64`、`mingwX64`、および`macosX64`）間でのみ共有されます。

**解決策**。現在、テンプレートのソースセット間のデフォルトの`dependsOn`関係を変更する方法はありません。
また、`nativeMain`などのソースセットの実装と意味が、すべてのプロジェクトで同じであることが重要です。

ただし、次のいずれかを実行できます。

* デフォルトの階層テンプレートまたは手動で作成されたソースセットで、目的に合った別のソースセットを見つけます。
* `kotlin.mpp.applyDefaultHierarchyTemplate=false`を`gradle.properties`ファイルに追加してテンプレートを完全にオプトアウトし、すべてのソースセットを手動で構成します。

:::tip
現在、独自の階層テンプレートを作成するためのAPIに取り組んでいます。これは、階層構成がデフォルトのテンプレートと大幅に異なるプロジェクトに役立ちます。

このAPIはまだ準備ができていませんが、試してみたい場合は、
`applyHierarchyTemplate {}`ブロックと、例として`KotlinHierarchyTemplate.default`の宣言を確認してください。
このAPIはまだ開発中であることに注意してください。テストされていない可能性があり、今後のリリースで変更される可能性があります。

:::

#### 完全な階層テンプレートを見る

プロジェクトのコンパイル対象となるターゲットを宣言すると、
プラグインは、指定されたターゲットに基づいてテンプレートから共有ソースセットを選択し、プロジェクトに作成します。

<img src="/img/full-template-hierarchy.svg" alt="デフォルトの階層テンプレート" style={{verticalAlign: 'middle'}}/>
:::tip
この例では、プロジェクトのプロダクション部分のみを示しており、`Main`サフィックスを省略しています
（たとえば、`commonMain`の代わりに`common`を使用）。ただし、`*Test`ソースでもすべて同じです。

:::

## 手動構成

ソースセット構造に中間ソースを手動で導入できます。
これは、いくつかのターゲットの共有コードを保持します。

たとえば、ネイティブのLinux、Windows、およびmacOSターゲット（`linuxX64`、`mingwX64`、および`macosX64`）間でコードを共有する場合、次の手順を実行します。

1. 共有モジュールの`build.gradle(.kts)`ファイルで、これらのターゲットの共有ロジックを保持する中間ソースセット`desktopMain`を追加します。
2. `dependsOn`関係を使用して、ソースセット階層を設定します。`commonMain`を`desktopMain`に接続し、次に`desktopMain`を各ターゲットソースセットに接続します。

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>
    
    ```kotlin
    kotlin {
        linuxX64()
        mingwX64()
        macosX64()
    
        sourceSets {
            val desktopMain by creating {
                dependsOn(commonMain.get())
            }
    
            linuxX64Main.get().dependsOn(desktopMain)
            mingwX64Main.get().dependsOn(desktopMain)
            macosX64Main.get().dependsOn(desktopMain)
        }
    }
    ```
    
    </TabItem>
    <TabItem value="groovy" label="Groovy" default>
    
    ```groovy
    kotlin {
        linuxX64()
        mingwX64()
        macosX64()
    
        sourceSets {
            desktopMain {
                dependsOn(commonMain.get())
            }
            linuxX64Main {
                dependsOn(desktopMain)
            }
            mingwX64Main {
                dependsOn(desktopMain)
            }
            macosX64Main {
                dependsOn(desktopMain)
            }
        }
    }
    ```
    
    </TabItem>
    </Tabs>

結果として得られる階層構造は次のようになります。

<img src="/img/manual-hierarchical-structure.svg" alt="手動で構成された階層構造" style={{verticalAlign: 'middle'}}/>

次のターゲットの組み合わせに対して共有ソースセットを持つことができます。

* JVMまたはAndroid + JS + Native
* JVMまたはAndroid + Native
* JS + Native
* JVMまたはAndroid + JS
* Native

Kotlinは現在、これらの組み合わせのソースセットの共有をサポートしていません。

* 複数のJVMターゲット
* JVM + Androidターゲット
* 複数のJSターゲット

共有ネイティブソースセットからプラットフォーム固有のAPIにアクセスする必要がある場合、IntelliJ IDEAは、共有ネイティブコードで使用できる共通の宣言を検出するのに役立ちます。
その他の場合は、Kotlinの[expectedとactualの宣言](multiplatform-expect-actual)のメカニズムを使用してください。