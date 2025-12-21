[//]: # (title: Kotlin Multiplatformプロジェクト構造の基本)

Kotlin Multiplatformを使用すると、異なるプラットフォーム間でコードを共有できます。この記事では、共有コードの制約、コードの共有部分とプラットフォーム固有の部分を区別する方法、およびこの共有コードが動作するプラットフォームを指定する方法について説明します。

また、共通コード、ターゲット、プラットフォーム固有および中間ソースセット、テスト統合など、Kotlin Multiplatformプロジェクト設定のコアコンセプトについても学習します。これにより、将来的にマルチプラットフォームプロジェクトをセットアップするのに役立ちます。

ここで提示されるモデルは、Kotlinが使用するモデルと比較して簡略化されています。しかし、この基本的なモデルはほとんどの場合で十分であるはずです。

## 共通コード

_共通コード_は、異なるプラットフォーム間で共有されるKotlinコードです。

単純な「Hello, World」の例を考えます。

```kotlin
fun greeting() {
    println("Hello, Kotlin Multiplatform!")
}
```

プラットフォーム間で共有されるKotlinコードは通常、`commonMain`ディレクトリに配置されます。コードファイルの場所は、このコードがコンパイルされるプラットフォームのリストに影響するため重要です。

Kotlinコンパイラはソースコードを入力として受け取り、その結果としてプラットフォーム固有のバイナリのセットを生成します。マルチプラットフォームプロジェクトをコンパイルする場合、同じコードから複数のバイナリを生成できます。たとえば、コンパイラは同じKotlinファイルからJVMの`.class`ファイルとネイティブ実行可能ファイルを生成できます。

![Common code](common-code-diagram.svg){width=700}

すべてのKotlinコードがすべてのプラットフォームにコンパイルできるわけではありません。Kotlinコンパイラは、プラットフォーム固有の関数やクラスを共通コードで使用することを防ぎます。なぜなら、このコードは異なるプラットフォームにコンパイルできないためです。

たとえば、`java.io.File`の依存関係を共通コードから使用することはできません。これはJDKの一部ですが、共通コードはネイティブコードにもコンパイルされ、そこではJDKクラスは利用できません。

![Unresolved Java reference](unresolved-java-reference.png){width=500}

共通コードでは、Kotlin Multiplatformライブラリを使用できます。これらのライブラリは、異なるプラットフォームで異なる方法で実装できる共通APIを提供します。この場合、プラットフォーム固有のAPIは追加部分として機能し、共通コードでそのようなAPIを使用しようとするとエラーになります。

たとえば、`kotlinx.coroutines`はすべてのターゲットをサポートするKotlin Multiplatformライブラリですが、`fun CoroutinesDispatcher.asExecutor(): Executor`のように`kotlinx.coroutines`の並行プリミティブをJDKの並行プリミティブに変換するプラットフォーム固有の部分も持っています。このAPIの追加部分は`commonMain`では利用できません。

## ターゲット

ターゲットは、Kotlinが共通コードをコンパイルするプラットフォームを定義します。これらは、たとえばJVM、JS、Android、iOS、またはLinuxである可能性があります。前の例では、共通コードをJVMとネイティブターゲットにコンパイルしました。

_Kotlinターゲット_は、コンパイルターゲットを記述する識別子です。それは、生成されるバイナリの形式、利用可能な言語構造、および許可される依存関係を定義します。

> ターゲットはプラットフォームとも呼ばれます。サポートされているターゲットの完全なリストは[こちら](multiplatform-dsl-reference.md#targets)をご覧ください。
>
{style="note"}

特定のターゲットのコードをコンパイルするようにKotlinに指示するには、まずターゲットを_宣言_する必要があります。Gradleでは、`kotlin {}`ブロック内で定義済みのDSL呼び出しを使用してターゲットを宣言します。

```kotlin
kotlin {
    jvm() // Declares a JVM target
    iosArm64() // Declares a target that corresponds to 64-bit iPhones
}
```

このようにして、各マルチプラットフォームプロジェクトはサポートされるターゲットのセットを定義します。ビルドスクリプトでのターゲットの宣言について詳しく知るには、[階層型プロジェクト構造](multiplatform-hierarchy.md)セクションを参照してください。

`jvm`と`iosArm64`ターゲットが宣言されている場合、`commonMain`内の共通コードはこれらのターゲットにコンパイルされます。

![Targets](target-diagram.svg){width=700}

特定のターゲットにどのコードがコンパイルされるかを理解するために、ターゲットをKotlinソースファイルに付加されたラベルとして考えることができます。Kotlinはこれらのラベルを使用して、コードをコンパイルする方法、生成するバイナリ、およびそのコードで許可される言語構造と依存関係を決定します。

`greeting.kt`ファイルを`.js`にもコンパイルしたい場合は、JSターゲットを宣言するだけで済みます。その後、`commonMain`内のコードはJSターゲットに対応する追加の`js`ラベルを受け取り、Kotlinに`.js`ファイルを生成するように指示します。

![Target labels](target-labels-diagram.svg){width=700}

これが、Kotlinコンパイラが宣言されたすべてのターゲットにコンパイルされる共通コードで動作する方法です。プラットフォーム固有のコードの記述方法については、[ソースセット](#source-sets)を参照してください。

## ソースセット

_Kotlinソースセット_は、独自のターゲット、依存関係、およびコンパイラオプションを持つソースファイルのセットです。これは、マルチプラットフォームプロジェクトでコードを共有する主要な方法です。

マルチプラットフォームプロジェクトの各ソースセットは次のとおりです。

*   特定のプロジェクトで一意の名前を持ちます。
*   通常、ソースセットの名前が付いたディレクトリに保存されているソースファイルとリソースのセットを含みます。
*   このソースセットのコードがコンパイルされるターゲットのセットを指定します。
*   これらのターゲットは、このソースセットで利用可能な言語構造と依存関係に影響を与えます。
*   独自の依存関係とコンパイラオプションを定義します。

Kotlinには、多数の事前定義されたソースセットが用意されています。そのうちの1つは`commonMain`で、すべてのマルチプラットフォームプロジェクトに存在し、宣言されたすべてのターゲットにコンパイルされます。

Kotlin Multiplatformプロジェクトでは、`src`内のディレクトリとしてソースセットを操作します。
たとえば、`commonMain`、`iosMain`、`jvmMain`のソースセットを持つプロジェクトは、次の構造を持ちます。

![Shared sources](src-directory-diagram.png){width=350}

Gradleスクリプトでは、`kotlin.sourceSets {}`ブロック内で名前によってソースセットにアクセスします。

```kotlin
kotlin {
    // Targets declaration:
    // …

    // Source set declaration:
    sourceSets {
        commonMain {
            // Configure the commonMain source set
        }
    }
}
```

`commonMain`以外に、他のソースセットはプラットフォーム固有または中間である場合があります。

### プラットフォーム固有のソースセット

共通コードのみを持つことは便利ですが、常に可能であるとは限りません。`commonMain`内のコードは宣言されたすべてのターゲットにコンパイルされ、Kotlinはそこにプラットフォーム固有のAPIを使用することを許可しません。

ネイティブおよびJSターゲットを持つマルチプラットフォームプロジェクトでは、`commonMain`内の次のコードはコンパイルされません。

```kotlin
// commonMain/kotlin/common.kt
// Doesn't compile in common code
fun greeting() {
    java.io.File("greeting.txt").writeText("Hello, Multiplatform!")
}
```

解決策として、Kotlinはプラットフォーム固有のソースセット（プラットフォームソースセットとも呼ばれる）を作成します。各ターゲットには、そのターゲットのみにコンパイルされる対応するプラットフォームソースセットがあります。たとえば、`jvm`ターゲットには、JVMのみにコンパイルされる対応する`jvmMain`ソースセットがあります。Kotlinは、これらのソースセットでプラットフォーム固有の依存関係を使用することを許可します。たとえば、`jvmMain`ではJDKを使用できます。

```kotlin
// jvmMain/kotlin/jvm.kt
// You can use Java dependencies in the `jvmMain` source set
fun jvmGreeting() {
    java.io.File("greeting.txt").writeText("Hello, Multiplatform!")
}
```

### 特定のターゲットへのコンパイル

特定のターゲットへのコンパイルは、複数のソースセットで機能します。Kotlinがマルチプラットフォームプロジェクトを特定のターゲットにコンパイルする場合、そのターゲットでラベル付けされたすべてのソースセットを収集し、それらからバイナリを生成します。

`jvm`、`iosArm64`、および`js`ターゲットの例を考えます。Kotlinは、共通コード用の`commonMain`ソースセットと、特定のターゲットに対応する`jvmMain`、`iosArm64Main`、および`jsMain`ソースセットを作成します。

![Compilation to a specific target](specific-target-diagram.svg){width=700}

JVMへのコンパイル中、Kotlinは「JVM」とラベル付けされたすべてのソースセット、すなわち`jvmMain`と`commonMain`を選択します。その後、それらをまとめてJVMクラスファイルにコンパイルします。

![Compilation to JVM](compilation-jvm-diagram.svg){width=700}

Kotlinは`commonMain`と`jvmMain`を一緒にコンパイルするため、結果のバイナリには`commonMain`と`jvmMain`の両方からの宣言が含まれます。

マルチプラットフォームプロジェクトで作業する場合、次の点に注意してください。

*   Kotlinに特定のプラットフォームにコードをコンパイルさせたい場合は、対応するターゲットを宣言します。
*   コードを保存するディレクトリまたはソースファイルを選択するには、まずどのターゲット間でコードを共有するかを決定します。
    *   コードがすべてのターゲット間で共有される場合、`commonMain`で宣言する必要があります。
    *   コードが1つのターゲットのみに使用される場合、そのターゲットのプラットフォーム固有のソースセット（たとえば、JVMの場合は`jvmMain`）で定義する必要があります。
*   プラットフォーム固有のソースセットで記述されたコードは、共通ソースセットからの宣言にアクセスできます。たとえば、`jvmMain`内のコードは`commonMain`からのコードを使用できます。しかし、その逆は真ではありません。`commonMain`は`jvmMain`からのコードを使用できません。
*   プラットフォーム固有のソースセットで記述されたコードは、対応するプラットフォームの依存関係を使用できます。たとえば、`jvmMain`内のコードは、[Guava](https://github.com/google/guava)や[Spring](https://spring.io/)のようなJava専用ライブラリを使用できます。

### 中間ソースセット

単純なマルチプラットフォームプロジェクトには、通常、共通コードとプラットフォーム固有のコードしかありません。`commonMain`ソースセットは、宣言されたすべてのターゲット間で共有される共通コードを表します。`jvmMain`のようなプラットフォーム固有のソースセットは、それぞれのターゲットのみにコンパイルされるプラットフォーム固有のコードを表します。

実際には、より詳細なコード共有が必要になることがよくあります。

すべての最新のAppleデバイスとAndroidデバイスをターゲットにする必要がある例を考えます。

```kotlin
kotlin {
    android()
    iosArm64()   // 64-bit iPhone devices
    macosArm64() // Modern Apple Silicon-based Macs
    watchosX64() // Modern 64-bit Apple Watch devices
    tvosArm64()  // Modern Apple TV devices  
}
```

そして、すべてのAppleデバイス用のUUIDを生成する関数を追加するためのソースセットが必要です。

```kotlin
import platform.Foundation.NSUUID

fun randomUuidString(): String {
    // You want to access Apple-specific APIs
    return NSUUID().UUIDString()
}
```

この関数を`commonMain`に追加することはできません。`commonMain`はAndroidを含む宣言されたすべてのターゲットにコンパイルされますが、`platform.Foundation.NSUUID`はAndroidでは利用できないApple固有のAPIです。`commonMain`で`NSUUID`を参照しようとすると、Kotlinはエラーを表示します。

このコードを各Apple固有のソースセット、すなわち`iosArm64Main`、`macosArm64Main`、`watchosX64Main`、および`tvosArm64Main`にコピー＆ペーストすることもできます。しかし、このようにコードを複製する方法はエラーの原因となりやすいため、推奨されません。

この問題を解決するには、_中間ソースセット_を使用できます。中間ソースセットは、プロジェクト内のすべてのターゲットではなく、一部のターゲットにコンパイルされるKotlinソースセットです。中間ソースセットは、階層型ソースセット、または単に階層と呼ばれることもあります。

Kotlinは、デフォルトでいくつかの中間ソースセットを作成します。この特定の場合、結果のプロジェクト構造は次のようになります。

![Intermediate source sets](intermediate-source-sets-diagram.svg){width=700}

ここで、下部の多色のブロックはプラットフォーム固有のソースセットです。分かりやすくするために、ターゲットラベルは省略されています。

`appleMain`ブロックは、Apple固有のターゲットにコンパイルされるコードを共有するためにKotlinによって作成された中間ソースセットです。`appleMain`ソースセットはAppleターゲットのみにコンパイルされます。したがって、Kotlinは`appleMain`でApple固有のAPIを使用することを許可しており、`randomUUID()`関数をここに追加できます。

> [階層型プロジェクト構造](multiplatform-hierarchy.md)を参照して、Kotlinがデフォルトで作成および設定するすべての中間ソースセットを見つけ、デフォルトで必要とする中間ソースセットがKotlinによって提供されない場合にどうすべきかを学びましょう。
>
{style="tip"}

特定のターゲットへのコンパイル中、Kotlinは、このターゲットでラベル付けされた中間ソースセットを含むすべてのソースセットを取得します。したがって、`commonMain`、`appleMain`、および`iosArm64Main`ソースセットに記述されたすべてのコードは、`iosArm64`プラットフォームターゲットへのコンパイル中に結合されます。

![Native executables](multiplatform-executables-diagram.svg){width=700}

> 一部のソースセットにソースがなくても問題ありません。たとえば、iOS開発では、通常、iOSデバイスに固有だがiOSシミュレーターには固有ではないコードを提供する必要はありません。したがって、`iosArm64Main`はめったに使用されません。
>
{style="tip"}

#### Appleデバイスとシミュレーターのターゲット {initial-collapse-state="collapsed" collapsible="true"}

Kotlin Multiplatformを使用してiOSモバイルアプリケーションを開発する場合、通常は`iosMain`ソースセットを使用します。`ios`ターゲットのプラットフォーム固有のソースセットだと考えるかもしれませんが、単一の`ios`ターゲットは存在しません。ほとんどのモバイルプロジェクトには、少なくとも2つのターゲットが必要です。

*   **デバイスターゲット**は、iOSデバイスで実行できるバイナリを生成するために使用されます。現在、iOSのデバイスターゲットは`iosArm64`のみです。
*   **シミュレーターターゲット**は、お使いのマシンで起動されるiOSシミュレーター用のバイナリを生成するために使用されます。Apple silicon Macコンピューターをお持ちの場合は、`iosSimulatorArm64`をシミュレーターターゲットとして選択してください。IntelベースのMacコンピューターをお持ちの場合は、`iosX64`を使用してください。

`iosArm64`デバイスターゲットのみを宣言した場合、ローカルマシンでアプリケーションとテストを実行およびデバッグすることはできません。

`iosArm64Main`、`iosSimulatorArm64Main`、`iosX64Main`のようなプラットフォーム固有のソースセットは、iOSデバイスとシミュレーター向けのKotlinコードが通常同じであるため、通常は空です。それらすべてでコードを共有するには、`iosMain`中間ソースセットのみを使用できます。

他のMac以外のAppleターゲットにも同じことが当てはまります。たとえば、Apple TV用の`tvosArm64`デバイスターゲットと、Apple siliconおよびIntelベースのデバイス上のApple TVシミュレーター用の`tvosSimulatorArm64`および`tvosX64`シミュレーターターゲットがある場合、それらすべてに`tvosMain`中間ソースセットを使用できます。

## テストとの統合

実際のプロジェクトでは、主要なプロダクションコードに加えてテストも必要です。これが、デフォルトで作成されるすべてのソースセットに`Main`と`Test`のサフィックスが付いている理由です。`Main`にはプロダクションコードが含まれ、`Test`にはこのコードのテストが含まれます。それらの間の接続は自動的に確立され、テストは追加の構成なしで`Main`コードによって提供されるAPIを使用できます。

`Test`に対応するものは、`Main`と同様にソースセットです。たとえば、`commonTest`は`commonMain`の対応物であり、宣言されたすべてのターゲットにコンパイルされるため、共通テストを記述できます。`jvmTest`のようなプラットフォーム固有のテストソースセットは、プラットフォーム固有のテスト、たとえばJVM固有のテストやJVM APIを必要とするテストを記述するために使用されます。

共通テストを記述するためのソースセットがあるだけでなく、マルチプラットフォームテストフレームワークも必要です。Kotlinは、`@kotlin.Test`アノテーションと`assertEquals`や`assertTrue`などのさまざまなアサーションメソッドが付属するデフォルトの[`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/)ライブラリを提供します。

各プラットフォームのプラットフォーム固有のテストを、それぞれのソースセットで通常のテストのように記述できます。メインコードと同様に、各ソースセットにプラットフォーム固有の依存関係を持つことができます。たとえば、JVMには`JUnit`、iOSには`XCTest`などです。特定のターゲットのテストを実行するには、`<targetName>Test`タスクを使用します。

マルチプラットフォームテストの作成と実行方法については、[マルチプラットフォームアプリのテストチュートリアル](multiplatform-run-tests.md)で学習してください。

## 次のステップ

*   [Gradleスクリプトで事前定義されたソースセットを宣言して使用する方法について詳しく学ぶ](multiplatform-hierarchy.md)
*   [マルチプラットフォームプロジェクト構造の高度な概念を探求する](multiplatform-advanced-project-structure.md)
*   [ターゲットのコンパイルとカスタムコンパイルの作成について詳しく学ぶ](multiplatform-configure-compilations.md)