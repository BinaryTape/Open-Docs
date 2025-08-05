[//]: # (title: マルチプラットフォームプロジェクト構造の高度な概念)

本記事では、Kotlin Multiplatformプロジェクト構造の高度な概念と、それらがGradleの実装にどのように対応するかを説明します。この情報は、Gradleビルドの低レベルの抽象化（コンフィギュレーション、タスク、パブリケーションなど）を扱う必要がある場合や、Kotlin Multiplatformビルド用のGradleプラグインを作成する場合に役立ちます。

このページは、次のような場合に役立ちます。

*   Kotlinがソースセットを作成しない一連のターゲット間でコードを共有する必要がある場合。
*   Kotlin Multiplatformビルド用のGradleプラグインを作成したい場合、またはコンフィギュレーション、タスク、パブリケーションなど、Gradleビルドの低レベルの抽象化を扱う必要がある場合。

マルチプラットフォームプロジェクトにおける依存関係管理で理解すべき重要なことの1つは、Gradleスタイルのプロジェクトまたはライブラリ依存関係と、Kotlinに固有のソースセット間の`dependsOn`関係の違いです。

*   `dependsOn`は、共通ソースセットとプラットフォーム固有ソースセット間の関係であり、[ソースセット階層](#dependson-and-source-set-hierarchies)およびマルチプラットフォームプロジェクト全体でのコード共有を可能にします。デフォルトのソースセットの場合、階層は自動的に管理されますが、特定の状況で変更する必要がある場合があります。
*   ライブラリおよびプロジェクトの依存関係は一般的に通常どおり機能しますが、マルチプラットフォームプロジェクトで適切に管理するには、コンパイルに使用される粒度の細かい**ソースセット → ソースセット**の依存関係に、[Gradleの依存関係がどのように解決されるか](#dependencies-on-other-libraries-or-projects)を理解する必要があります。

> 高度な概念に入る前に、[マルチプラットフォームプロジェクト構造の基本](multiplatform-discover-project.md)を学習することをお勧めします。
>
{style="tip"}

## dependsOnとソースセット階層

通常、_依存関係_を扱い、_`dependsOn`_関係は扱いません。しかし、`dependsOn`を検証することは、Kotlin Multiplatformプロジェクトが内部でどのように機能するかを理解するために不可欠です。

`dependsOn`は、2つのKotlinソースセット間のKotlin固有の関係です。これは、共通ソースセットとプラットフォーム固有ソースセット間の接続である可能性があります。例えば、`jvmMain`ソースセットが`commonMain`に依存し、`iosArm64Main`が`iosMain`に依存する場合などです。

Kotlinソースセット`A`と`B`の一般的な例を考えてみましょう。`A.dependsOn(B)`という式は、Kotlinに次のように指示します。

1.  `A`は、内部宣言を含む`B`からのAPIを認識します。
2.  `A`は、`B`からの期待される宣言に対して`actual`な実装を提供できます。これは必要かつ十分な条件であり、`A`が`B`に対して`actual`を提供できるのは、`A.dependsOn(B)`が直接的または間接的に存在する場合に限られます。
3.  `B`は、自身のターゲットに加えて、`A`がコンパイルするすべてのターゲットに対してコンパイルされるべきです。
4.  `A`は、`B`のすべての通常の依存関係を継承します。

`dependsOn`関係は、ソースセット階層として知られるツリー状の構造を作成します。以下は、`androidTarget`、`iosArm64`（iPhoneデバイス）、および`iosSimulatorArm64`（Apple Silicon Mac用のiPhoneシミュレーター）を含むモバイル開発の典型的なプロジェクトの例です。

![DependsOn tree structure](dependson-tree-diagram.svg){width=700}

矢印は`dependsOn`関係を表します。これらの関係は、プラットフォームバイナリのコンパイル中に保持されます。これにより、Kotlinは`iosMain`が`commonMain`からのAPIを認識すべきであり、`iosArm64Main`からは認識すべきではないことを理解します。

![DependsOn relations during compilation](dependson-relations-diagram.svg){width=700}

`dependsOn`関係は、`KotlinSourceSet.dependsOn(KotlinSourceSet)`呼び出しで設定されます。例えば、次のとおりです。

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
*   `dependsOn`関係は、ビルドスクリプトの`dependencies {}`ブロックとは別に宣言されます。これは、`dependsOn`が通常の依存関係ではなく、異なるターゲット間でコードを共有するために必要なKotlinソースセット間の特定の関係であるためです。

`dependsOn`を使用して、公開されたライブラリや別のGradleプロジェクトへの通常の依存関係を宣言することはできません。例えば、`commonMain`が`kotlinx-coroutines-core`ライブラリの`commonMain`に依存するように設定したり、`commonTest.dependsOn(commonMain)`を呼び出したりすることはできません。

### カスタムソースセットの宣言

場合によっては、プロジェクトにカスタムの中間ソースセットが必要になることがあります。JVM、JS、Linuxにコンパイルされるプロジェクトで、JVMとJSの間でのみ一部のソースを共有したい場合を考えてみましょう。この場合、[マルチプラットフォームプロジェクト構造の基本](multiplatform-discover-project.md)で説明されているように、このターゲットペアに特化したソースセットを見つける必要があります。

Kotlinはこのようなソースセットを自動的に作成しません。これは、`by creating`構文を使用して手動で作成する必要があることを意味します。

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

しかし、Kotlinはまだこのソースセットの扱い方やコンパイル方法を認識していません。図にすると、このソースセットは孤立しており、ターゲットラベルが何も付いていない状態になります。

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

> `dependsOn`関係を手動で設定すると、デフォルトの階層テンプレートの自動適用が無効になります。
> このようなケースの詳細と対処方法については、[追加設定](multiplatform-hierarchy.md#additional-configuration)を参照してください。
>
{style="note"}

## 他のライブラリやプロジェクトへの依存関係

マルチプラットフォームプロジェクトでは、公開されたライブラリまたは別のGradleプロジェクトのいずれかに通常の依存関係を設定できます。

Kotlin Multiplatformでは、通常Gradleの標準的な方法で依存関係を宣言します。Gradleと同様に、次のことを行います。

*   ビルドスクリプトで`dependencies {}`ブロックを使用します。
*   例えば、`implementation`や`api`など、依存関係に適切なスコープを選択します。
*   依存関係を参照するには、リポジトリで公開されている場合は`"com.google.guava:guava:32.1.2-jre"`のようにその座標を指定するか、同じビルド内のGradleプロジェクトである場合は`project(":utils:concurrency")`のようにそのパスを指定します。

マルチプラットフォームプロジェクトにおける依存関係の設定には、いくつかの特別な機能があります。各Kotlinソースセットには独自の`dependencies {}`ブロックがあります。これにより、プラットフォーム固有のソースセットでプラットフォーム固有の依存関係を宣言できます。

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

依存関係解決には、3つの重要な概念があります。

1.  マルチプラットフォームの依存関係は、`dependsOn`構造を介して伝播されます。`commonMain`に依存関係を追加すると、`commonMain`に直接的または間接的に`dependsOn`関係を宣言しているすべてのソースセットに自動的に追加されます。

    この場合、依存関係はすべての`*Main`ソースセット（`iosMain`、`jvmMain`、`iosSimulatorArm64Main`、`iosX64Main`）に自動的に追加されました。これらのソースセットはすべて、`commonMain`ソースセットから`kotlin-coroutines-core`の依存関係を継承するため、手動ですべてにコピー＆ペーストする必要はありません。

    ![Propagation of multiplatform dependencies](dependency-propagation-diagram.svg){width=700}

    > この伝播メカニズムにより、特定のソースセットを選択することで、宣言された依存関係を受け取るスコープを選択できます。
    > 例えば、iOSで`kotlinx.coroutines`を使用したいがAndroidでは使用したくない場合、この依存関係を`iosMain`のみに追加できます。
    >
    {style="tip"}

2.  上記の`commonMain`から`org.jetbrians.kotlinx:kotlinx-coroutines-core:1.7.3`のような_ソースセット → マルチプラットフォームライブラリ_の依存関係は、依存関係解決の中間状態を表します。解決の最終状態は常に_ソースセット → ソースセット_の依存関係によって表されます。

    > 最終的な_ソースセット → ソースセット_の依存関係は、`dependsOn`関係ではありません。
    >
    {style="note"}

    粒度の細かい_ソースセット → ソースセット_の依存関係を推論するために、Kotlinは各マルチプラットフォームライブラリと共に公開されるソースセット構造を読み取ります。このステップの後、各ライブラリは全体としてではなく、そのソースセットのコレクションとして内部的に表現されます。`kotlinx-coroutines-core`の例を次に示します。

    ![Serialization of the source set structure](structure-serialization-diagram.svg){width=700}

3.  Kotlinは各依存関係を取り、それを依存関係からのソースセットのコレクションに解決します。そのコレクション内の各依存関係ソースセットは、_互換性のあるターゲット_を持つ必要があります。依存関係ソースセットは、コンシューマソースセットと_少なくとも同じターゲット_にコンパイルされる場合に、互換性のあるターゲットを持つと見なされます。

    サンプルプロジェクトの`commonMain`が`androidTarget`、`iosX64`、`iosSimulatorArm64`にコンパイルされる例を考えてみましょう。

    *   まず、`kotlinx-coroutines-core.commonMain`への依存関係を解決します。これは、`kotlinx-coroutines-core`が可能なすべてのKotlinターゲットにコンパイルされるためです。したがって、その`commonMain`は、必要な`androidTarget`、`iosX64`、`iosSimulatorArm64`を含む可能なすべてのターゲットにコンパイルされます。
    *   次に、`commonMain`は`kotlinx-coroutines-core.concurrentMain`に依存します。`kotlinx-coroutines-core`の`concurrentMain`はJSを除くすべてのターゲットにコンパイルされるため、コンシューマプロジェクトの`commonMain`のターゲットと一致します。

    しかし、コルーチンからの`iosX64Main`のようなソースセットは、コンシューマの`commonMain`と互換性がありません。`iosX64Main`が`commonMain`のターゲットの1つである`iosX64`にコンパイルされるにもかかわらず、`androidTarget`にも`iosSimulatorArm64`にもコンパイルされません。

    依存関係解決の結果は、`kotlinx-coroutines-core`のどのコードが可視になるかに直接影響します。

    ![Error on JVM-specific API in common code](dependency-resolution-error.png){width=700}

### ソースセット間で共通依存関係のバージョンを調整する

Kotlin Multiplatformプロジェクトでは、共通ソースセットはklibを生成するため、また設定された各[コンパイル](multiplatform-configure-compilations.md)の一部として、複数回コンパイルされます。一貫性のあるバイナリを生成するために、共通コードは常に同じバージョンのマルチプラットフォーム依存関係に対してコンパイルされるべきです。Kotlin Gradleプラグインはこれらの依存関係の調整を支援し、各ソースセットで有効な依存関係バージョンが同じになるようにします。

上記の例で、`androidMain`ソースセットに`androidx.navigation:navigation-compose:2.7.7`の依存関係を追加したいと想像してください。あなたのプロジェクトでは、`commonMain`ソースセットに対して`kotlinx-coroutines-core:1.7.3`の依存関係を明示的に宣言していますが、バージョン2.7.7のCompose NavigationライブラリはKotlin coroutines 1.8.0以降を必要とします。`commonMain`と`androidMain`は一緒にコンパイルされるため、Kotlin Gradleプラグインはコルーチンライブラリの2つのバージョンから選択し、`kotlinx-coroutines-core:1.8.0`を`commonMain`ソースセットに適用します。しかし、共通コードが設定されたすべてのターゲットで一貫してコンパイルされるようにするには、iOSソースセットも同じ依存関係バージョンに制約される必要があります。そのため、Gradleは`kotlinx.coroutines-*:1.8.0`の依存関係を`iosMain`ソースセットにも伝播させます。

![Alignment of dependencies among *Main source sets](multiplatform-source-set-dependency-alignment.svg){width=700}

依存関係は、`*Main`ソースセットと[`*Test`ソースセット](multiplatform-discover-project.md#integration-with-tests)の間で個別に調整されます。`*Test`ソースセットのGradleコンフィギュレーションには、`*Main`ソースセットのすべての依存関係が含まれますが、その逆はありません。これにより、メインコードに影響を与えることなく、新しいライブラリバージョンでプロジェクトをテストできます。

例えば、プロジェクト内のすべてのソースセットに伝播されたKotlin coroutines 1.7.3の依存関係が`*Main`ソースセットに含まれているとします。しかし、`iosTest`ソースセットでは、新しいライブラリリリースを試すためにバージョンを1.8.0にアップグレードすることにしました。同じアルゴリズムに従って、この依存関係は`*Test`ソースセットのツリー全体に伝播され、すべての`*Test`ソースセットは`kotlinx.coroutines-*:1.8.0`の依存関係でコンパイルされます。

![Test source sets resolving dependencies separately from the main source sets](test-main-source-set-dependency-alignment.svg)

## コンパイル

単一プラットフォームプロジェクトとは異なり、Kotlin Multiplatformプロジェクトでは、すべてのアーティファクトをビルドするために複数のコンパイラ起動が必要です。各コンパイラの起動は_Kotlinコンパイル_です。

例えば、前述のKotlinコンパイル中にiPhoneデバイス用のバイナリがどのように生成されるかを次に示します。

![Kotlin compilation for iOS](ios-compilation-diagram.svg){width=700}

Kotlinコンパイルはターゲットの下にグループ化されます。デフォルトでは、Kotlinは各ターゲットに対して2つのコンパイル（プロダクションソース用の`main`コンパイルとテストソース用の`test`コンパイル）を作成します。

ビルドスクリプト内のコンパイルには、同様の方法でアクセスします。まずKotlinターゲットを選択し、次に内部の`compilations`コンテナにアクセスし、最後にその名前で必要なコンパイルを選択します。

```kotlin
kotlin {
    // Declare and configure the JVM target
    jvm {
        val mainCompilation: KotlinJvmCompilation = compilations.getByName("main")
    }
}
```