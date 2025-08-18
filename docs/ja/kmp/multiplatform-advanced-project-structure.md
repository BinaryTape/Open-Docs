[//]: # (title: マルチプラットフォームプロジェクト構造の高度な概念)

この記事では、Kotlin Multiplatformプロジェクト構造の高度な概念と、それらがGradleの実装にどのように対応するかを説明します。この情報は、Gradleビルドの低レベルの抽象化（構成 (configurations)、タスク (tasks)、公開 (publications) など）を扱う必要がある場合や、Kotlin Multiplatformビルド用のGradleプラグインを作成する場合に役立ちます。

このページは、以下のような場合に役立ちます。

*   Kotlinがソースセットを作成しないターゲット群の間でコードを共有する必要がある場合。
*   Kotlin Multiplatformビルド用のGradleプラグインを作成したい場合、または構成 (configurations)、タスク (tasks)、公開 (publications) など、Gradleビルドの低レベルの抽象化を扱う必要がある場合。

マルチプラットフォームプロジェクトにおける依存関係管理で理解すべき重要な点の1つは、Gradleスタイルのプロジェクトまたはライブラリの依存関係と、Kotlinに特有のソースセット間の`dependsOn`関係との違いです。

*   `dependsOn`は、共通ソースセットとプラットフォーム固有ソースセット間の関係であり、[ソースセット階層](#dependson-and-source-set-hierarchies)とマルチプラットフォームプロジェクトでの一般的なコード共有を可能にします。デフォルトのソースセットの場合、階層は自動的に管理されますが、特定の状況で変更する必要がある場合があります。
*   ライブラリとプロジェクトの依存関係は一般的に通常通り機能しますが、マルチプラットフォームプロジェクトでそれらを適切に管理するには、[Gradleの依存関係がどのように解決されるか](#dependencies-on-other-libraries-or-projects)を理解し、コンパイルに使用される粒度の高い**ソースセット → ソースセット**の依存関係に変換する方法を知る必要があります。

> 高度な概念に入る前に、[マルチプラットフォームプロジェクト構造の基本](multiplatform-discover-project.md)を学ぶことをお勧めします。
>
{style="tip"}

## dependsOnとソースセット階層

通常、あなたは_依存関係_を扱い、_`dependsOn`_関係を扱うことはありません。しかし、`dependsOn`を調べることは、Kotlin Multiplatformプロジェクトが内部でどのように機能するかを理解するために不可欠です。

`dependsOn`は、2つのKotlinソースセット間のKotlinに特有の関係です。これは、`jvmMain`ソースセットが`commonMain`に依存し、`iosArm64Main`が`iosMain`に依存する、といった共通ソースセットとプラットフォーム固有ソースセット間の接続であり得ます。

Kotlinソースセット`A`と`B`の一般的な例を考えてみましょう。`A.dependsOn(B)`という表現は、Kotlinに対して以下を指示します。

1.  `A`は、内部宣言を含む`B`のAPIを参照します。
2.  `A`は、`B`の期待される宣言に対してactual実装を提供できます。これは必要十分条件です。なぜなら、`A`が`B`に対して`actuals`を提供できるのは、`A.dependsOn(B)`が直接的または間接的に存在する場合に限られるからです。
3.  `B`は、自身のターゲットに加えて、`A`がコンパイルするすべてのターゲットに対してもコンパイルされるべきです。
4.  `A`は、`B`のすべての通常の依存関係を継承します。

`dependsOn`関係は、ソースセット階層として知られるツリーのような構造を作成します。以下は、`androidTarget`、`iosArm64`（iPhoneデバイス）、および`iosSimulatorArm64`（Apple Silicon Mac用のiPhoneシミュレーター）を含むモバイル開発の典型的なプロジェクトの例です。

![DependsOn tree structure](dependson-tree-diagram.svg){width=700}

矢印は`dependsOn`関係を表します。
これらの関係は、プラットフォームバイナリのコンパイル中に保持されます。これにより、Kotlinは`iosMain`が`commonMain`のAPIを参照するように意図されているが、`iosArm64Main`のAPIではないことを理解します。

![DependsOn relations during compilation](dependson-relations-diagram.svg){width=700}

`dependsOn`関係は、`KotlinSourceSet.dependsOn(KotlinSourceSet)`呼び出しで構成されます。例えば、以下のように記述します。

```kotlin
kotlin {
    // Targets declaration
    sourceSets {
        // Example of configuring the dependsOn relation 
        iosArm64Main.dependsOn(commonMain)
    }
}
```

*   この例は、ビルドスクリプトで`dependsOn`関係を定義する方法を示しています。しかし、Kotlin Gradleプラグインはデフォルトでソースセットを作成し、これらの関係を設定するため、手動で行う必要はありません。
*   `dependsOn`関係は、ビルドスクリプトの`dependencies {}`ブロックとは別に宣言されます。これは、`dependsOn`が通常の依存関係ではなく、異なるターゲット間でコードを共有するために必要なKotlinソースセット間の特定の関係だからです。

公開されたライブラリや他のGradleプロジェクトへの通常の依存関係を宣言するために`dependsOn`を使用することはできません。例えば、`commonMain`を`kotlinx-coroutines-core`ライブラリの`commonMain`に依存させたり、`commonTest.dependsOn(commonMain)`を呼び出したりすることはできません。

### カスタムソースセットの宣言

場合によっては、プロジェクトにカスタムの中間ソースセットが必要になることがあります。JVM、JS、Linuxにコンパイルされるプロジェクトで、JVMとJSの間だけで一部のソースを共有したいとします。この場合、[マルチプラットフォームプロジェクト構造の基本](multiplatform-discover-project.md)で説明されているように、このターゲットのペアに特化したソースセットを見つける必要があります。

Kotlinはそのようなソースセットを自動的に作成しません。そのため、`by creating`コンストラクションを使用して手動で作成する必要があります。

```kotlin
kotlin {
    jvm()
    js()
    linuxX64()

    sourceSets {
        // Create a source set named "jvmAndJs"
        val jvmAndJsMain by creating {
            // …
        }
    }
}
```

しかし、Kotlinはまだこのソースセットをどのように扱うか、またはコンパイルするかを知りません。図を描くと、このソースセットは孤立しており、どのターゲットラベルも持たないでしょう。

![Missing dependsOn relation](missing-dependson-diagram.svg){width=700}

これを修正するには、いくつかの`dependsOn`関係を追加して、`jvmAndJsMain`を階層に含めます。

```kotlin
kotlin {
    jvm()
    js()
    linuxX64()

    sourceSets {
        val jvmAndJsMain by creating {
            // Don't forget to add dependsOn to commonMain
            dependsOn(commonMain.get())
        }

        jvmMain {
            dependsOn(jvmAndJsMain)
        }

        jsMain {
            dependsOn(jvmAndJsMain)
        }
    }
}
```

ここで、`jvmMain.dependsOn(jvmAndJsMain)`はJVMターゲットを`jvmAndJsMain`に追加し、`jsMain.dependsOn(jvmAndJsMain)`はJSターゲットを`jvmAndJsMain`に追加します。

最終的なプロジェクト構造は次のようになります。

![Final project structure](final-structure-diagram.svg){width=700}

> `dependsOn`関係を手動で構成すると、デフォルトの階層テンプレートの自動適用が無効になります。[追加設定](multiplatform-hierarchy.md#additional-configuration)で、そのようなケースとそれらの対処方法について詳しく学んでください。
>
{style="note"}

## 他のライブラリやプロジェクトへの依存関係

マルチプラットフォームプロジェクトでは、公開されたライブラリまたは他のGradleプロジェクトに通常の依存関係を設定できます。

Kotlin Multiplatformでは、一般的にGradleの典型的な方法で依存関係を宣言します。Gradleと同様に、次のことを行います。

*   ビルドスクリプトで`dependencies {}`ブロックを使用します。
*   `implementation`や`api`など、依存関係に適切なスコープを選択します。
*   依存関係を、リポジトリで公開されている場合は`"com.google.guava:guava:32.1.2-jre"`のように座標を指定するか、同じビルド内のGradleプロジェクトである場合は`project(":utils:concurrency")`のようにそのパスを指定して参照します。

マルチプラットフォームプロジェクトにおける依存関係の構成には、いくつかの特別な機能があります。各Kotlinソースセットは独自の`dependencies {}`ブロックを持っています。これにより、プラットフォーム固有のソースセットでプラットフォーム固有の依存関係を宣言できます。

```kotlin
kotlin {
    // Targets declaration
    sourceSets {
        jvmMain.dependencies {
            // This is jvmMain's dependencies, so it's OK to add a JVM-specific dependency
            implementation("com.google.guava:guava:32.1.2-jre")
        }
    }
}
```

共通の依存関係はより複雑です。例えば、`kotlinx.coroutines`のようなマルチプラットフォームライブラリへの依存関係を宣言するマルチプラットフォームプロジェクトを考えてみましょう。

```kotlin
kotlin {
    androidTarget()     // Android
    iosArm64()          // iPhone devices 
    iosSimulatorArm64() // iPhone simulator on Apple Silicon Mac

    sourceSets {
        commonMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
        }
    }
}
```

依存関係の解決には、3つの重要な概念があります。

1.  マルチプラットフォームの依存関係は、`dependsOn`構造を下って伝播されます。`commonMain`に依存関係を追加すると、`commonMain`に対して直接的または間接的に`dependsOn`関係を宣言するすべてのソースセットに自動的に追加されます。

    この場合、依存関係は実際にすべての`*Main`ソースセット（`iosMain`、`jvmMain`、`iosSimulatorArm64Main`、`iosX64Main`）に自動的に追加されました。これらのソースセットはすべて`commonMain`ソースセットから`kotlin-coroutines-core`の依存関係を継承するため、手動ですべてにコピー＆ペーストする必要はありません。

    ![Propagation of multiplatform dependencies](dependency-propagation-diagram.svg){width=700}

    > 伝播メカニズムにより、特定のソースセットを選択することで、宣言された依存関係を受け取るスコープを選択できます。例えば、`kotlinx.coroutines`をiOSで使用したいがAndroidでは使用したくない場合、この依存関係を`iosMain`にのみ追加できます。
    >
    {style="tip"}

2.  上記の`commonMain`から`org.jetbrians.kotlinx:kotlinx-coroutines-core:1.7.3`のような_ソースセット → マルチプラットフォームライブラリ_の依存関係は、依存関係解決の中間状態を表します。解決の最終状態は常に_ソースセット → ソースセット_の依存関係で表されます。

    > 最終的な_ソースセット → ソースセット_の依存関係は、`dependsOn`関係ではありません。
    >
    {style="note"}

    粒度の高い_ソースセット → ソースセット_の依存関係を推論するために、Kotlinは各マルチプラットフォームライブラリと共に公開されるソースセット構造を読み取ります。このステップの後、各ライブラリは全体としてではなく、そのソースセットのコレクションとして内部的に表現されます。`kotlinx-coroutines-core`の例を見てください。

    ![Serialization of the source set structure](structure-serialization-diagram.svg){width=700}

3.  Kotlinは各依存関係を取り込み、それを依存関係からのソースセットのコレクションに解決します。そのコレクション内の各依存ソースセットは、_互換性のあるターゲット_を持っている必要があります。依存ソースセットが互換性のあるターゲットを持っているのは、コンシューマーソースセットと同じか、それ以上のターゲットにコンパイルされる場合です。

    サンプルプロジェクトの`commonMain`が`androidTarget`、`iosX64`、および`iosSimulatorArm64`にコンパイルされる例を考えてみましょう。

    *   まず、`kotlinx-coroutines-core.commonMain`への依存関係を解決します。これは、`kotlinx-coroutines-core`がすべての可能なKotlinターゲットにコンパイルされるためです。したがって、その`commonMain`は、必要な`androidTarget`、`iosX64`、および`iosSimulatorArm64`を含むすべての可能なターゲットにコンパイルされます。
    *   次に、`commonMain`は`kotlinx-coroutines-core.concurrentMain`に依存します。`kotlinx-coroutines-core`の`concurrentMain`はJSを除くすべてのターゲットにコンパイルされるため、コンシューマープロジェクトの`commonMain`のターゲットに一致します。

    しかし、コルーチンからの`iosX64Main`のようなソースセットは、コンシューマーの`commonMain`とは互換性がありません。`iosX64Main`は`commonMain`のターゲットの1つである`iosX64`にコンパイルされますが、`androidTarget`にも`iosSimulatorArm64`にもコンパイルされないからです。

    依存関係解決の結果は、`kotlinx-coroutines-core`のどのコードが可視になるかに直接影響します。

    ![Error on JVM-specific API in common code](dependency-resolution-error.png){width=700}

### ソースセット間で共通の依存関係のバージョンを調整する

Kotlin Multiplatformプロジェクトでは、共通ソースセットは、klibを生成し、構成された各[コンパイル](multiplatform-configure-compilations.md)の一部として、複数回コンパイルされます。一貫性のあるバイナリを生成するには、共通コードは毎回同じバージョンのマルチプラットフォーム依存関係に対してコンパイルされるべきです。Kotlin Gradleプラグインはこれらの依存関係を調整し、各ソースセットで実効的な依存関係のバージョンが同じであることを保証します。

上記の例で、`androidMain`ソースセットに`androidx.navigation:navigation-compose:2.7.7`依存関係を追加したいとします。あなたのプロジェクトは`commonMain`ソースセットに対して`kotlinx-coroutines-core:1.7.3`依存関係を明示的に宣言していますが、Compose Navigationライブラリのバージョン2.7.7はKotlinコルーチン1.8.0以降を必要とします。

`commonMain`と`androidMain`は一緒にコンパイルされるため、Kotlin Gradleプラグインはコルーチンライブラリの2つのバージョンの中から選択し、`commonMain`ソースセットに`kotlinx-coroutines-core:1.8.0`を適用します。しかし、共通コードがすべての設定されたターゲットで一貫してコンパイルされるように、iOSソースセットも同じ依存関係バージョンに制約される必要があります。そのため、Gradleは`kotlinx.coroutines-*:1.8.0`依存関係を`iosMain`ソースセットにも伝播させます。

![Alignment of dependencies among *Main source sets](multiplatform-source-set-dependency-alignment.svg){width=700}

依存関係は、`*Main`ソースセットと[`*Test`ソースセット](multiplatform-discover-project.md#integration-with-tests)の間で別々に調整されます。`*Test`ソースセットのGradle構成には`*Main`ソースセットのすべての依存関係が含まれますが、その逆はありません。これにより、メインコードに影響を与えることなく、新しいライブラリバージョンでプロジェクトをテストできます。

例えば、`*Main`ソースセットにはKotlinコルーチン1.7.3の依存関係があり、それがプロジェクトのすべてのソースセットに伝播されているとします。しかし、`iosTest`ソースセットでは、新しいライブラリリリースを試すためにバージョンを1.8.0にアップグレードすることにしました。同じアルゴリズムに従って、この依存関係は`*Test`ソースセットのツリー全体に伝播されるため、すべての`*Test`ソースセットは`kotlinx.coroutines-*:1.8.0`依存関係でコンパイルされます。

![Test source sets resolving dependencies separately from the main source sets](test-main-source-set-dependency-alignment.svg)

## コンパイル

シングルプラットフォームプロジェクトとは異なり、Kotlin Multiplatformプロジェクトでは、すべてのアーティファクトをビルドするために複数回のコンパイラ起動を必要とします。各コンパイラの起動は_Kotlinコンパイル_です。

例えば、前述のKotlinコンパイル中にiPhoneデバイス用のバイナリがどのように生成されるかを見てみましょう。

![Kotlin compilation for iOS](ios-compilation-diagram.svg){width=700}

Kotlinコンパイルはターゲットの下にグループ化されます。デフォルトでは、Kotlinは各ターゲットに対して2つのコンパイルを作成します。プロダクションソース用の`main`コンパイルと、テストソース用の`test`コンパイルです。

ビルドスクリプトでのコンパイルへのアクセスも同様の方法で行われます。まずKotlinターゲットを選択し、次にその内部の`compilations`コンテナにアクセスし、最後に名前で必要なコンパイルを選択します。

```kotlin
kotlin {
    // Declare and configure the JVM target
    jvm {
        val mainCompilation: KotlinJvmCompilation = compilations.getByName("main")
    }
}