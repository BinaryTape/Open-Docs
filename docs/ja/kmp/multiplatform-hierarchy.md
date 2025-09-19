[//]: # (title: 階層型プロジェクト構造)

Kotlinマルチプラットフォームプロジェクトは、階層的なソースセット構造をサポートしています。
これにより、一部の[サポートされているターゲット](multiplatform-dsl-reference.md#targets)間で共通コードを共有するための中間ソースセットの階層を構成できます。中間ソースセットを使用すると、以下のことが可能になります。

*   特定のターゲット向けのAPIを提供する。例えば、ライブラリはKotlin/Nativeターゲット向けの中間ソースセットでネイティブ固有のAPIを追加できますが、Kotlin/JVM向けには追加しません。
*   特定のターゲット向けのAPIを利用する。例えば、中間ソースセットを形成する一部のターゲットにKotlinマルチプラットフォームライブラリが提供する豊富なAPIから恩恵を受けることができます。
*   プロジェクトでプラットフォーム依存のライブラリを使用する。例えば、中間iOSソースセットからiOS固有の依存関係にアクセスできます。

Kotlinツールチェーンは、各ソースセットが、そのソースセットがコンパイルされるすべてのターゲットで利用可能なAPIのみにアクセスできるようにします。これにより、Windows固有のAPIを使用してからmacOSにコンパイルするといった、リンケージエラーや実行時の未定義の動作につながるケースを防ぎます。

ソースセットの階層を設定する推奨される方法は、[デフォルト階層テンプレート](#default-hierarchy-template)を使用することです。
このテンプレートは、最も一般的なケースをカバーしています。より高度なプロジェクトの場合は、[手動で設定](#manual-configuration)できます。
これはより低レベルなアプローチであり、より柔軟ですが、より多くの労力と知識を必要とします。

## デフォルト階層テンプレート

Kotlin Gradleプラグインには、ビルトインのデフォルト[階層テンプレート](#see-the-full-hierarchy-template)が用意されています。
これには、いくつかの一般的なユースケース向けの事前定義された中間ソースセットが含まれています。
プラグインは、プロジェクトで指定されたターゲットに基づいて、これらのソースセットを自動的に設定します。

共有コードを含むプロジェクトのモジュールにある次の`build.gradle(.kts)`ファイルを検討してください。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()
}
```

</TabItem>
</Tabs>

コードで`androidTarget`、`iosArm64`、`iosSimulatorArm64`ターゲットを宣言すると、Kotlin Gradleプラグインはテンプレートから適切な共有ソースセットを見つけ、それらを作成します。結果の階層は次のようになります。

![デフォルト階層テンプレートの使用例](default-hierarchy-example.svg)

色付きのソースセットは実際に作成されプロジェクトに存在しますが、デフォルトテンプレートからの灰色のソースセットは無視されます。例えば、Kotlin Gradleプラグインは、プロジェクトにwatchOSターゲットがないため、`watchos`ソースセットを作成しませんでした。

`watchosArm64`のようなwatchOSターゲットを追加すると、`watchos`ソースセットが作成され、`apple`、`native`、および`common`ソースセットからのコードも`watchosArm64`にコンパイルされます。

Kotlin Gradleプラグインは、デフォルト階層テンプレートのすべてのソースセットに対して型安全な静的アクセサを提供しているため、[手動設定](#manual-configuration)と比較して`by getting`や`by creating`のような構成を使用せずに参照できます。

対応するターゲットを最初に宣言せずに共有モジュールの`build.gradle(.kts)`ファイルでソースセットにアクセスしようとすると、警告が表示されます。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        iosMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
        // Warning: ターゲットを宣言せずにソースセットにアクセスしています
        linuxX64Main { }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        iosMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
        // Warning: ターゲットを宣言せずにソースセットにアクセスしています
        linuxX64Main { }
    }
}
```

</TabItem>
</Tabs>

> この例では、`apple`と`native`ソースセットは`iosArm64`と`iosSimulatorArm64`ターゲットにのみコンパイルされます。
> それらの名前にもかかわらず、これらは完全なiOS APIにアクセスできます。
> これは、`native`のようなソースセットにとっては直感的ではないかもしれません。というのも、このソースセットではすべてのネイティブターゲットで利用可能なAPIのみがアクセス可能であると期待されるからです。この動作は将来変更される可能性があります。
>
{style="note"}

### 追加の設定

デフォルト階層テンプレートを調整する必要がある場合があります。以前に`dependsOn`呼び出しで中間ソースを[手動で](#manual-configuration)導入している場合、それはデフォルト階層テンプレートの使用をキャンセルし、以下の警告につながります。

```none
The Default Kotlin Hierarchy Template was not applied to '<project-name>':
Explicit .dependsOn() edges were configured for the following source sets:
[<... names of the source sets with manually configured dependsOn-edges...>]

Consider removing dependsOn-calls or disabling the default template by adding
    'kotlin.mpp.applyDefaultHierarchyTemplate=false'
to your gradle.properties

Learn more about hierarchy templates: https://kotl.in/hierarchy-template
```

この問題を解決するには、以下のいずれかの方法でプロジェクトを設定してください。

*   [手動設定をデフォルト階層テンプレートに置き換える](#replacing-a-manual-configuration)
*   [デフォルト階層テンプレートにソースセットを追加する](#creating-additional-source-sets)
*   [デフォルト階層テンプレートによって作成されたソースセットを変更する](#modifying-source-sets)

#### 手動設定の置き換え

**ケース**。すべての中間ソースセットが、現在デフォルト階層テンプレートでカバーされている場合。

**解決策**。共有モジュールの`build.gradle(.kts)`ファイルから、すべての手動の`dependsOn()`呼び出しと`by creating`構築を持つソースセットを削除します。すべてのデフォルトソースセットのリストを確認するには、[フル階層テンプレート](#see-the-full-hierarchy-template)を参照してください。

#### 追加ソースセットの作成

**ケース**。デフォルト階層テンプレートがまだ提供していないソースセットを追加したい場合。例えば、macOSターゲットとJVMターゲットの間にソースセットを追加する場合。

**解決策**：

1.  共有モジュールの`build.gradle(.kts)`ファイルで、`applyDefaultHierarchyTemplate()`を明示的に呼び出してテンプレートを再適用します。
2.  `dependsOn()`を使用して、追加のソースセットを[手動で](#manual-configuration)設定します。

    <Tabs group="build-script">
    <TabItem title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        jvm()
        macosArm64()
        iosArm64()
        iosSimulatorArm64()
    
        // デフォルト階層を再度適用します。これにより、例えば`iosMain`ソースセットが作成されます。
        applyDefaultHierarchyTemplate()
    
        sourceSets {
            // `jvmAndMacos`ソースセットを追加で作成します。
            val jvmAndMacos by creating {
                dependsOn(commonMain.get())
            }
    
            macosArm64Main.get().dependsOn(jvmAndMacos)
            jvmMain.get().dependsOn(jvmAndMacos)
        }
    }
    ```

    </TabItem>
    <TabItem title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        jvm()
        macosArm64()
        iosArm64()
        iosSimulatorArm64()
    
        // デフォルト階層を再度適用します。これにより、例えば`iosMain`ソースセットが作成されます。
        applyDefaultHierarchyTemplate()
    
        sourceSets {
            // `jvmAndMacos`ソースセットを追加で作成します。
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

#### ソースセットの変更

**ケース**。テンプレートによって生成されたものとまったく同じ名前のソースセットが既にあり、それらがプロジェクト内の異なるターゲットセット間で共有されている場合。例えば、`nativeMain`ソースセットがデスクトップ固有のターゲット（`linuxX64`、`mingwX64`、および`macosX64`）の間でのみ共有されている場合。

**解決策**。現在、テンプレートのソースセット間のデフォルトの`dependsOn`関係を変更する方法はありません。
また、`nativeMain`のようなソースセットの実装と意味がすべてのプロジェクトで同じであることが重要です。

ただし、以下のいずれかを実行することは可能です。

*   目的のために、デフォルト階層テンプレート内にある、または手動で作成された異なるソースセットを見つける。
*   `gradle.properties`ファイルに`kotlin.mpp.applyDefaultHierarchyTemplate=false`を追加してテンプレートから完全にオプトアウトし、すべてのソースセットを手動で設定する。

> 現在、独自の階層テンプレートを作成するためのAPIに取り組んでいます。これは、その階層設定がデフォルトテンプレートと大きく異なるプロジェクトにとって役立つでしょう。
>
> このAPIはまだ準備ができていませんが、試してみたい場合は、
> `applyHierarchyTemplate {}`ブロックと`KotlinHierarchyTemplate.default`の宣言を例として参照してください。
> このAPIはまだ開発中であることに注意してください。テストされていない可能性があり、今後のリリースで変更される可能性があります。
>
{style="tip"}

#### フル階層テンプレートを見る {initial-collapse-state="collapsed" collapsible="true"}

プロジェクトがコンパイルするターゲットを宣言すると、
プラグインはテンプレートから指定されたターゲットに基づいて共有ソースセットを選択し、それらをプロジェクト内に作成します。

![デフォルト階層テンプレート](full-template-hierarchy.svg)

> この例は、プロジェクトのプロダクション部分のみを示しており、`Main`サフィックスは省略されています
> （例えば、`commonMain`の代わりに`common`を使用しています）。ただし、すべて`*Test`ソースについても同様です。
>
{style="tip"}

## 手動設定

ソースセット構造に中間ソースを手動で導入できます。
これは、複数のターゲット間で共有されるコードを保持します。

例えば、ネイティブLinux、Windows、macOSターゲット（`linuxX64`、`mingwX64`、および`macosX64`）間でコードを共有したい場合の対処法は次のとおりです。

1.  共有モジュールの`build.gradle(.kts)`ファイルで、これらのターゲットの共有ロジックを保持する中間ソースセット`myDesktopMain`を追加します。
2.  `dependsOn`関係を使用して、ソースセットの階層を設定します。`commonMain`を`myDesktopMain`に接続し、次に`myDesktopMain`を各ターゲットソースセットに接続します。

    <Tabs group="build-script">
    <TabItem title="Kotlin" group-key="kotlin">
    
    ```kotlin
    kotlin {
        linuxX64()
        mingwX64()
        macosX64()
    
        sourceSets {
            val myDesktopMain by creating {
                dependsOn(commonMain.get())
            }
    
            linuxX64Main.get().dependsOn(myDesktopMain)
            mingwX64Main.get().dependsOn(myDesktopMain)
            macosX64Main.get().dependsOn(myDesktopMain)
        }
    }
    ```
    
    </TabItem>
    <TabItem title="Groovy" group-key="groovy">
    
    ```groovy
    kotlin {
        linuxX64()
        mingwX64()
        macosX64()
    
        sourceSets {
            myDesktopMain {
                dependsOn(commonMain.get())
            }
            linuxX64Main {
                dependsOn(myDesktopMain)
            }
            mingwX64Main {
                dependsOn(myDesktopMain)
            }
            macosX64Main {
                dependsOn(myDesktopMain)
            }
        }
    }
    ```
    
    </TabItem>
    </Tabs>

結果の階層構造は次のようになります。

![手動で設定された階層構造](manual-hierarchical-structure.svg)

以下のターゲットの組み合わせに対して、共有ソースセットを持つことができます。

*   JVMまたはAndroid + JS + Native
*   JVMまたはAndroid + Native
*   JS + Native
*   JVMまたはAndroid + JS
*   Native

Kotlinは現在、以下の組み合わせでのソースセット共有をサポートしていません。

*   複数のJVMターゲット
*   JVM + Androidターゲット
*   複数のJSターゲット

共有ネイティブソースセットからプラットフォーム固有のAPIにアクセスする必要がある場合、IntelliJ IDEAは共有ネイティブコードで使用できる共通の宣言を検出するのに役立ちます。
その他のケースでは、Kotlinの[`expect`/`actual`宣言](multiplatform-expect-actual.md)のメカニズムを使用してください。