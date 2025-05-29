[//]: # (title: Kotlin 1.9.0の新機能)

[リリース日: 2023年7月6日](releases.md#release-details)

Kotlin 1.9.0がリリースされ、JVM向けK2コンパイラーは**ベータ版**になりました。その他、主なハイライトは以下の通りです。

*   [新しいKotlin K2コンパイラーの更新](#new-kotlin-k2-compiler-updates)
*   [enumクラスの`values`関数の安定版の代替](#stable-replacement-of-the-enum-class-values-function)
*   [開区間範囲のための安定した`..<`演算子](#stable-operator-for-open-ended-ranges)
*   [名前で正規表現のキャプチャグループを取得する新しい共通関数](#new-common-function-to-get-regex-capture-group-by-name)
*   [親ディレクトリを作成する新しいパスユーティリティ](#new-path-utility-to-create-parent-directories)
*   [Kotlin MultiplatformにおけるGradle Configuration Cacheのプレビュー](#preview-of-the-gradle-configuration-cache)
*   [Kotlin MultiplatformにおけるAndroidターゲットサポートの変更点](#changes-to-android-target-support)
*   [Kotlin/Nativeにおけるカスタムメモリ割り当て器のプレビュー](#preview-of-custom-memory-allocator)
*   [Kotlin/Nativeにおけるライブラリリンケージ](#library-linkage-in-kotlin-native)
*   [Kotlin/Wasmにおけるサイズ関連の最適化](#size-related-optimizations)

これらの更新の簡単な概要は、こちらのビデオでもご覧いただけます。

<video src="https://www.youtube.com/v/fvwTZc-dxsM" title="What's new in Kotlin 1.9.0"/>

## IDEサポート

1.9.0をサポートするKotlinプラグインは、以下のIDEで利用できます。

| IDE | サポートバージョン |
|--|--|
| IntelliJ IDEA | 2022.3.x, 2023.1.x |
| Android Studio | Giraffe (223), Hedgehog (231)* |

*Kotlin 1.9.0プラグインは、今後のリリースでAndroid Studio Giraffe (223)およびHedgehog (231)に含まれる予定です。

Kotlin 1.9.0プラグインは、今後のリリースでIntelliJ IDEA 2023.2に含まれる予定です。

> Kotlinのアーティファクトと依存関係をダウンロードするには、Maven Central Repositoryを使用するように[Gradle設定を構成してください](#configure-gradle-settings)。
>
{style="warning"}

## 新しいKotlin K2コンパイラーの更新

JetBrainsのKotlinチームはK2コンパイラーの安定化を進めており、1.9.0リリースではさらなる進歩をもたらします。
JVM向けK2コンパイラーは現在**ベータ版**です。

Kotlin/Nativeおよびマルチプラットフォームプロジェクトの基本的なサポートも追加されました。

### kaptコンパイラープラグインのK2コンパイラーとの互換性

[kaptプラグイン](kapt.md)はK2コンパイラーと一緒にプロジェクトで使用できますが、いくつかの制限があります。
`languageVersion`を`2.0`に設定しているにもかかわらず、kaptコンパイラープラグインは引き続き古いコンパイラーを利用します。

`languageVersion`が`2.0`に設定されているプロジェクト内でkaptコンパイラープラグインを実行すると、kaptは自動的に`1.9`に切り替わり、特定のバージョン互換性チェックを無効にします。この動作は、以下のコマンド引数を含めることと同じです。
*   `-Xskip-metadata-version-check`
*   `-Xskip-prerelease-check`
*   `-Xallow-unstable-dependencies`

これらのチェックはkaptタスク専用に無効化されます。他のすべてのコンパイルタスクは引き続き新しいK2コンパイラーを利用します。

K2コンパイラーでkaptを使用する際に問題に遭遇した場合は、[課題トラッカー](http://kotl.in/issue)に報告してください。

### プロジェクトでK2コンパイラーを試す

1.9.0からKotlin 2.0のリリースまでの間、`gradle.properties`ファイルに`kotlin.experimental.tryK2=true` Gradleプロパティを追加することで、K2コンパイラーを簡単にテストできます。以下のコマンドを実行することもできます。

```shell
./gradlew assemble -Pkotlin.experimental.tryK2=true
```

このGradleプロパティは、言語バージョンを自動的に2.0に設定し、現在のコンパイラーと比較してK2コンパイラーを使用してコンパイルされたKotlinタスクの数でビルドレポートを更新します。

```none
##### 'kotlin.experimental.tryK2' results (Kotlin/Native not checked) #####
:lib:compileKotlin: 2.0 language version
:app:compileKotlin: 2.0 language version
##### 100% (2/2) tasks have been compiled with Kotlin 2.0 #####
```

### Gradleビルドレポート

[Gradleビルドレポート](gradle-compilation-and-caches.md#build-reports)は、コードのコンパイルに現在のコンパイラーとK2コンパイラーのどちらが使用されたかを表示するようになりました。Kotlin 1.9.0では、[Gradleビルドスキャン](https://scans.gradle.com/)でこの情報を見ることができます。

![Gradle build scan - K1](gradle-build-scan-k1.png){width=700}

![Gradle build scan - K2](gradle-build-scan-k2.png){width=700}

プロジェクトで使用されているKotlinバージョンもビルドレポートに直接表示されます。

```none
Task info:
  Kotlin language version: 1.9
```

> Gradle 8.0を使用している場合、特にGradle Configuration Cacheが有効になっていると、ビルドレポートでいくつかの問題に遭遇する可能性があります。これは既知の問題で、Gradle 8.1以降で修正されています。
>
{style="note"}

### 現在のK2コンパイラーの制限事項

GradleプロジェクトでK2を有効にすると、特定の制限が伴います。これらの制限は、以下のケースでGradleバージョン8.3未満を使用するプロジェクトに影響を与える可能性があります。

*   `buildSrc`からのソースコードのコンパイル。
*   インクルードビルド内のGradleプラグインのコンパイル。
*   Gradleバージョン8.3未満のプロジェクトで使用されている場合の他のGradleプラグインのコンパイル。
*   Gradleプラグインの依存関係のビルド。

上記のいずれかの問題に遭遇した場合は、以下の手順で対処できます。

*   `buildSrc`、すべてのGradleプラグイン、およびその依存関係の言語バージョンを設定します。

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
        apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
    }
}
```

*   プロジェクトのGradleバージョンを8.3が利用可能になったら更新します。

### 新しいK2コンパイラーに関するフィードバック

フィードバックをお待ちしております！

*   K2開発者に直接フィードバックを提供してください。KotlinのSlack – [招待を受ける](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)から、[#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257)チャネルに参加してください。
*   新しいK2コンパイラーで直面した問題を[課題トラッカー](https://kotl.in/issue)に報告してください。
*   JetBrainsがK2の使用に関する匿名データを収集できるように、[**使用統計を送信**オプションを有効にしてください](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)。

## 言語

Kotlin 1.9.0では、以前導入されたいくつかの新しい言語機能を安定化させています。
*   [enumクラスの`values`関数の代替](#stable-replacement-of-the-enum-class-values-function)
*   [データクラスとの対称性のためのデータオブジェクト](#stable-data-objects-for-symmetry-with-data-classes)
*   [インライン値クラスにおけるボディを持つセカンダリコンストラクターのサポート](#support-for-secondary-constructors-with-bodies-in-inline-value-classes)

### enumクラスの`values`関数の安定版の代替

1.8.20では、enumクラスの`entries`プロパティが試験的機能として導入されました。`entries`プロパティは、合成された`values()`関数の現代的で高性能な代替です。1.9.0では、`entries`プロパティは安定版になりました。

> `values()`関数は引き続きサポートされていますが、代わりに`entries`プロパティを使用することをお勧めします。
>
{style="tip"}

```kotlin
enum class Color(val colorName: String, val rgb: String) {
    RED("Red", "#FF0000"),
    ORANGE("Orange", "#FF7F00"),
    YELLOW("Yellow", "#FFFF00")
}

fun findByRgb(rgb: String): Color? = Color.entries.find { it.rgb == rgb }
```
{validate="false"}

enumクラスの`entries`プロパティの詳細については、「[Kotlin 1.8.20の新機能](whatsnew1820.md#a-modern-and-performant-replacement-of-the-enum-class-values-function)」を参照してください。

### データクラスとの対称性のためのデータオブジェクトの安定版

[Kotlin 1.8.20](whatsnew1820.md#preview-of-data-objects-for-symmetry-with-data-classes)で導入されたデータオブジェクト宣言は、安定版になりました。これには、データクラスとの対称性のために追加された`toString()`、`equals()`、`hashCode()`関数が含まれます。

この機能は、`sealed`階層（`sealed class`や`sealed interface`階層など）で特に役立ちます。なぜなら、`data object`宣言を`data class`宣言と一緒に便利に使用できるからです。この例では、`EndOfFile`を単なる`object`ではなく`data object`として宣言することで、手動でオーバーライドする必要なく、自動的に`toString()`関数を持つことができます。これにより、付随するデータクラスの定義との対称性が維持されます。

```kotlin
sealed interface ReadResult
data class Number(val number: Int) : ReadResult
data class Text(val text: String) : ReadResult
data object EndOfFile : ReadResult

fun main() {
    println(Number(7)) // Number(number=7)
    println(EndOfFile) // EndOfFile
}
```
{validate="false"}

詳細については、「[Kotlin 1.8.20の新機能](whatsnew1820.md#preview-of-data-objects-for-symmetry-with-data-classes)」を参照してください。

### インライン値クラスにおけるボディを持つセカンダリコンストラクターのサポート

Kotlin 1.9.0以降、[インライン値クラス](inline-classes.md)におけるボディを持つセカンダリコンストラクターの使用がデフォルトで利用可能になりました。

```kotlin
@JvmInline
value class Person(private val fullName: String) {
    // Allowed since Kotlin 1.4.30:
    init {
        check(fullName.isNotBlank()) {
            "Full name shouldn't be empty"
        }
    }
    // Allowed by default since Kotlin 1.9.0:
    constructor(name: String, lastName: String) : this("$name $lastName") {
        check(lastName.isNotBlank()) {
            "Last name shouldn't be empty"
        }
    }
}
```
{validate="false"}

以前は、Kotlinはインラインクラスでpublicなプライマリコンストラクターのみを許可していました。その結果、基になる値をカプセル化したり、制約された値を表現するインラインクラスを作成したりすることは不可能でした。

Kotlinの開発が進むにつれて、これらの問題は修正されました。Kotlin 1.4.30は`init`ブロックの制限を解除し、その後Kotlin 1.8.20ではボディを持つセカンダリコンストラクターのプレビューが導入されました。これらは現在、デフォルトで利用可能です。Kotlinインラインクラスの開発について詳しくは、[このKEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md)を参照してください。

## Kotlin/JVM

バージョン1.9.0以降、コンパイラーはJVM 20に対応するバイトコードバージョンを持つクラスを生成できます。さらに、`JvmDefault`アノテーションとレガシーな`-Xjvm-default`モードの非推奨化が継続されます。

### JvmDefaultアノテーションとレガシーな-Xjvm-defaultモードの非推奨化

Kotlin 1.5以降、`JvmDefault`アノテーションの使用は、新しい`-Xjvm-default`モードである`all`および`all-compatibility`に代わって非推奨になりました。Kotlin 1.4での`JvmDefaultWithoutCompatibility`、Kotlin 1.6での`JvmDefaultWithCompatibility`の導入により、これらのモードは`DefaultImpls`クラスの生成の包括的な制御を提供し、古いKotlinコードとのシームレスな互換性を保証します。

結果として、Kotlin 1.9.0では、`JvmDefault`アノテーションはもはや意味を持たなくなり、非推奨としてマークされ、エラーになります。最終的にKotlinから削除されます。

## Kotlin/Native

このリリースでは、その他の改善の中でも、[Kotlin/Nativeメモリマネージャー](native-memory-manager.md)のさらなる進歩がもたらされ、その堅牢性とパフォーマンスが向上するはずです。

*   [カスタムメモリ割り当て器のプレビュー](#preview-of-custom-memory-allocator)
*   [メインスレッドでのObjective-CまたはSwiftオブジェクトのデアロケーションフック](#objective-c-or-swift-object-deallocation-hook-on-the-main-thread)
*   [Kotlin/Nativeで定数にアクセスする際のオブジェクトの初期化なし](#no-object-initialization-when-accessing-constant-values-in-kotlin-native)
*   [iOSシミュレーターテストのスタンドアロンモードを構成する機能](#ability-to-configure-standalone-mode-for-ios-simulator-tests-in-kotlin-native)
*   [Kotlin/Nativeにおけるライブラリリンケージ](#library-linkage-in-kotlin-native)

### カスタムメモリ割り当て器のプレビュー

Kotlin 1.9.0では、カスタムメモリ割り当て器のプレビューが導入されます。その割り当てシステムは、[Kotlin/Nativeメモリマネージャー](native-memory-manager.md)の実行時パフォーマンスを向上させます。

Kotlin/Nativeの現在のオブジェクト割り当てシステムは、効率的なガベージコレクションの機能を備えていない汎用アロケーターを使用しています。それを補うために、ガベージコレクター（GC）がそれらを単一のリストにマージする前に、すべての割り当てられたオブジェクトのスレッドローカルなリンクリストを保持し、それはスイープ中にイテレートできます。このアプローチには、いくつかのパフォーマンス上の欠点があります。

*   スイープの順序はメモリの局所性がなく、しばしば散乱したメモリアクセスパターンをもたらし、潜在的なパフォーマンス問題につながります。
*   リンクリストは各オブジェクトに追加のメモリを必要とし、特に多くの小さなオブジェクトを扱う場合にメモリ使用量を増加させます。
*   割り当てられたオブジェクトの単一リストでは、スイープを並列化することが困難になり、ミューテーターのスレッドがGCスレッドがそれらを収集するよりも速くオブジェクトを割り当てる場合にメモリ使用量の問題が発生する可能性があります。

これらの問題に対処するため、Kotlin 1.9.0ではカスタムアロケーターのプレビューが導入されます。これはシステムメモリをページに分割し、連続した順序での独立したスイープを可能にします。各割り当てはページ内のメモリーブロックとなり、ページはブロックサイズを追跡します。さまざまなページタイプがさまざまな割り当てサイズに最適化されています。メモリーブロックの連続的な配置により、すべての割り当てられたブロックを効率的に反復できます。

スレッドがメモリを割り当てるとき、割り当てサイズに基づいて適切なページを検索します。スレッドはさまざまなサイズカテゴリのページセットを保持します。通常、与えられたサイズに対する現在のページは割り当てを収容できます。そうでない場合、スレッドは共有割り当てスペースから別のページを要求します。このページはすでに利用可能であるか、スイープを必要とするか、まず作成されるべきです。

新しいアロケーターは、複数の独立した割り当てスペースを同時に持つことを可能にし、これにより、Kotlinチームはさまざまなページレイアウトを試して、パフォーマンスをさらに向上させることができます。

新しいアロケーターの設計に関する詳細については、この[README](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)を参照してください。

#### 有効化方法

`-Xallocator=custom`コンパイラーオプションを追加します。

```kotlin
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {
                freeCompilerArgs.add("-Xallocator=custom")
            }
        }
    }
}
```
{validate="false"}

#### フィードバックを残す

カスタムアロケーターを改善するために、[YouTrack](https://youtrack.jetbrains.com/issue/KT-55364/Implement-custom-allocator-for-Kotlin-Native)でのフィードバックをお待ちしております。

### メインスレッドでのObjective-CまたはSwiftオブジェクトのデアロケーションフック

Kotlin 1.9.0以降、Objective-CまたはSwiftオブジェクトがKotlinに渡された場合、そのデアロケーションフックはメインスレッドで呼び出されます。[Kotlin/Nativeメモリマネージャー](native-memory-manager.md)が以前Objective-Cオブジェクトへの参照を処理していた方法では、メモリリークにつながる可能性がありました。新しい振る舞いはメモリマネージャーの堅牢性を向上させると信じています。

Kotlinコードで参照されるObjective-Cオブジェクト（例えば、引数として渡される場合、関数によって返される場合、またはコレクションから取得される場合）を考えます。この場合、KotlinはObjective-Cオブジェクトへの参照を保持する独自のオブジェクトを作成します。Kotlinオブジェクトがデアロケートされると、Kotlin/NativeランタイムはObjective-C参照を解放する`objc_release`関数を呼び出します。

以前は、Kotlin/Nativeメモリマネージャーは`objc_release`を特別なGCスレッドで実行しました。それが最後のオブジェクト参照である場合、オブジェクトはデアロケートされます。Objective-CオブジェクトがObjective-Cの`dealloc`メソッドやSwiftの`deinit`ブロックのようなカスタムデアロケーションフックを持ち、これらのフックが特定の呼び出しスレッドを想定している場合に問題が発生する可能性がありました。

メインスレッド上のオブジェクトのフックは通常そこで呼び出されることを期待するため、Kotlin/Nativeランタイムも`objc_release`をメインスレッドで呼び出すようになりました。これは、Objective-CオブジェクトがメインスレッドでKotlinに渡され、そこでKotlinのピアオブジェクトを作成した場合をカバーするはずです。これは、メインディスパッチキューが処理される場合にのみ機能します。これは通常のUIアプリケーションの場合です。メインキューではない場合、またはオブジェクトがメイン以外のスレッドでKotlinに渡された場合、`objc_release`は以前と同様に特別なGCスレッドで呼び出されます。

#### オプトアウト方法

問題に直面した場合は、`gradle.properties`ファイルで以下のオプションを使用してこの動作を無効にできます。

```none
kotlin.native.binary.objcDisposeOnMain=false
```

このようなケースは[課題トラッカー](https://kotl.in/issue)に報告することを躊躇しないでください。

### Kotlin/Nativeで定数にアクセスする際のオブジェクトの初期化なし

Kotlin 1.9.0以降、Kotlin/Nativeバックエンドは`const val`フィールドにアクセスする際にオブジェクトを初期化しません。

```kotlin
object MyObject {
    init {
        println("side effect!")
    }

    const val y = 1
}

fun main() {
    println(MyObject.y) // No initialization at first
    val x = MyObject    // Initialization occurs
    println(x.y)
}
```
{validate="false"}

この動作はKotlin/JVMと統一されました。Kotlin/JVMではJavaと一貫した実装がされており、この場合オブジェクトは決して初期化されません。この変更により、Kotlin/Nativeプロジェクトでパフォーマンスの向上が期待できます。

### iOSシミュレーターテストのスタンドアロンモードを構成する機能

デフォルトでは、Kotlin/NativeのiOSシミュレーターテストを実行する際に、手動でのシミュレーターの起動とシャットダウンを回避するために`--standalone`フラグが使用されます。1.9.0では、`standalone`プロパティを介して、Gradleタスクでこのフラグが使用されるかどうかを構成できるようになりました。デフォルトでは`--standalone`フラグが使用されるため、スタンドアロンモードが有効になります。

`build.gradle.kts`ファイルでスタンドアロンモードを無効にする例を以下に示します。

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.targets.native.tasks.KotlinNativeSimulatorTest>().configureEach {
    standalone.set(false)
}
```
{validate="false"}

> スタンドアロンモードを無効にした場合、シミュレーターを手動で起動する必要があります。CLIからシミュレーターを起動するには、以下のコマンドを使用できます。
>
> ```shell
> /usr/bin/xcrun simctl boot <DeviceId>
>```
>
{style="warning"}

### Kotlin/Nativeにおけるライブラリリンケージ

Kotlin 1.9.0以降、Kotlin/NativeコンパイラーはKotlinライブラリのリンケージの問題をKotlin/JVMと同じように扱います。
あるサードパーティのKotlinライブラリの作者が、別のサードパーティのKotlinライブラリが消費する試験的なAPIに互換性のない変更を加えた場合、このような問題に直面する可能性があります。

現在、サードパーティのKotlinライブラリ間のリンケージの問題がある場合でも、ビルドはコンパイル中に失敗しません。代わりに、JVMと同様に、これらのエラーは実行時にのみ発生します。

Kotlin/Nativeコンパイラーは、ライブラリリンケージに問題が検出されるたびに警告を報告します。これらの警告はコンパイルログで確認できます。以下に例を示します。

```text
No function found for symbol 'org.samples/MyRemovedClass.doSomething|3657632771909858561[0]'

Can not get instance of singleton 'MyEnumClass.REMOVED_ENTRY': No enum entry found for symbol 'org.samples/MyEnumClass.REMOVED_ENTRY|null[0]'

Function 'getMyRemovedClass' can not be called: Function uses unlinked class symbol 'org.samples/MyRemovedClass|null[0]'
```

プロジェクトでこの動作をさらに設定したり、無効にすることもできます。

*   これらの警告をコンパイルログに表示したくない場合は、`-Xpartial-linkage-loglevel=INFO`コンパイラーオプションで抑制します。
*   報告された警告の重大度を`-Xpartial-linkage-loglevel=ERROR`でコンパイルエラーまで引き上げることも可能です。この場合、コンパイルは失敗し、すべてのエラーがコンパイルログに表示されます。このオプションを使用して、リンケージの問題をより詳しく調べることができます。
*   この機能で予期しない問題に直面した場合は、いつでも`-Xpartial-linkage=disable`コンパイラーオプションでオプトアウトできます。このようなケースは[課題トラッカー](https://kotl.in/issue)に報告することを躊躇しないでください。

```kotlin
// Gradleビルドファイルを介してコンパイラーオプションを渡す例。
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {
                // リンケージ警告を抑制するには：
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=INFO")

                // リンケージ警告をエラーにするには：
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=ERROR")

                // 機能を完全に無効にするには：
                freeCompilerArgs.add("-Xpartial-linkage=disable")
            }
        }
    }
}
```
{validate="false"}

### Cインターオプの暗黙的な整数変換のためのコンパイラーオプション

Cインターオプのコンパイラーオプションを導入しました。これにより、暗黙的な整数変換を使用できます。慎重な検討の結果、この機能はまだ改善の余地があるため、意図しない使用を防ぐためにこのコンパイラーオプションを導入しました。私たちの目標は最高品質のAPIを持つことです。

このコードサンプルでは、[`options`](https://developer.apple.com/documentation/foundation/nscalendar/options)が符号なし型`UInt`を持ち、`0`が符号付きであるにもかかわらず、暗黙的な整数変換により`options = 0`が許可されます。

```kotlin
val today = NSDate()
val tomorrow = NSCalendar.currentCalendar.dateByAddingUnit(
    unit = NSCalendarUnitDay,
    value = 1,
    toDate = today,
    options = 0
)
```
{validate="false"}

ネイティブインターオプライブラリで暗黙的な変換を使用するには、`-XXLanguage:+ImplicitSignedToUnsignedIntegerConversion`コンパイラーオプションを使用します。

`build.gradle.kts`ファイルでこれを構成できます。
```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinNativeCompile>().configureEach {
    compilerOptions.freeCompilerArgs.addAll(
        "-XXLanguage:+ImplicitSignedToUnsignedIntegerConversion"
    )
}
```
{validate="false"}

## Kotlin Multiplatform

Kotlin Multiplatformは、開発者エクスペリエンスを向上させるように設計された注目すべき更新を1.9.0で受けました。

*   [Androidターゲットサポートの変更点](#changes-to-android-target-support)
*   [新しいAndroidソースセットレイアウトがデフォルトで有効に](#new-android-source-set-layout-enabled-by-default)
*   [マルチプラットフォームプロジェクトにおけるGradle Configuration Cacheのプレビュー](#preview-of-the-gradle-configuration-cache)

### Androidターゲットサポートの変更点

Kotlin Multiplatformの安定化に引き続き取り組んでいます。Androidターゲットへのファーストクラスのサポートを提供することが不可欠なステップです。将来的に、GoogleのAndroidチームがKotlin MultiplatformでAndroidをサポートするための独自のGradleプラグインを提供することを発表できることを嬉しく思います。

Googleからのこの新しいソリューションへの道を開くために、1.9.0で現在のKotlin DSLの`android`ブロックの名前を変更しています。ビルドスクリプト内の`android`ブロックのすべての出現箇所を`androidTarget`に変更してください。これは、Googleからの今後のDSLのために`android`という名前を解放するために必要な一時的な変更です。

Googleプラグインは、マルチプラットフォームプロジェクトでAndroidを扱うための推奨される方法になります。準備が整ったら、以前と同様に短い`android`の名前を使用できるよう、必要な移行手順を提供します。

### 新しいAndroidソースセットレイアウトがデフォルトで有効に

Kotlin 1.9.0以降、新しいAndroidソースセットレイアウトがデフォルトになりました。これは、複数の点で混乱を招くものであった、ディレクトリの以前の命名スキーマを置き換えました。新しいレイアウトにはいくつかの利点があります。

*   型セマンティクスの簡素化 – 新しいAndroidソースレイアウトは、さまざまな種類のソースセットを区別するのに役立つ、明確で一貫した命名規則を提供します。
*   ソースディレクトリレイアウトの改善 – 新しいレイアウトにより、`SourceDirectories`の配置がより一貫性を持つようになり、コードの整理とソースファイルの特定が容易になります。
*   Gradle構成の明確な命名スキーマ – スキーマは`KotlinSourceSets`と`AndroidSourceSets`の両方でより一貫性があり予測可能になりました。

新しいレイアウトにはAndroid Gradleプラグインバージョン7.0以降が必要であり、Android Studio 2022.3以降でサポートされています。`build.gradle(.kts)`ファイルで必要な変更を行うには、[移行ガイド](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-android-layout.html)を参照してください。

### Gradle Configuration Cacheのプレビュー

<anchor name="preview-of-gradle-configuration-cache"/>

Kotlin 1.9.0には、マルチプラットフォームライブラリにおける[Gradle Configuration Cache](https://docs.gradle.org/current/userguide/configuration_cache.html)のサポートが含まれています。ライブラリの作成者であれば、改善されたビルドパフォーマンスからすでに恩恵を受けることができます。

Gradle Configuration Cacheは、構成フェーズの結果を後続のビルドで再利用することで、ビルドプロセスを高速化します。この機能はGradle 8.1以降安定版になりました。有効にするには、[Gradleドキュメント](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)の指示に従ってください。

> Kotlin Multiplatformプラグインは、Xcode統合タスクや[Kotlin CocoaPods Gradleプラグイン](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-dsl-reference.html)とのGradle Configuration Cacheをまだサポートしていません。今後のKotlinリリースでこの機能を追加する予定です。
>
{style="note"}

## Kotlin/Wasm

Kotlinチームは新しいKotlin/Wasmターゲットの実験を続けています。このリリースでは、いくつかのパフォーマンスと[サイズ関連の最適化](#size-related-optimizations)に加え、[JavaScript相互運用性の更新](#updates-in-javascript-interop)も導入されます。

### サイズ関連の最適化

Kotlin 1.9.0では、WebAssembly（Wasm）プロジェクトに大幅なサイズ改善を導入しました。2つの「Hello World」プロジェクトを比較すると、Kotlin 1.9.0でのWasmのコードフットプリントは、Kotlin 1.8.20よりも10倍以上小さくなりました。

![Kotlin/Wasm size-related optimizations](wasm-1-9-0-size-improvements.png){width=700}

これらのサイズ最適化は、KotlinコードでWasmプラットフォームをターゲットとする際に、より効率的なリソース利用とパフォーマンスの向上をもたらします。

### JavaScript相互運用性の更新

このKotlinの更新では、Kotlin/WasmのKotlinとJavaScript間の相互運用性に関する変更が導入されます。Kotlin/Wasmは[試験的](components-stability.md#stability-levels-explained)機能であるため、その相互運用性には特定の制限が適用されます。

#### Dynamic型の制限

バージョン1.9.0以降、KotlinはKotlin/Wasmでの`Dynamic`型の使用をサポートしなくなりました。これは、JavaScriptの相互運用性を促進する新しい汎用`JsAny`型に代わって非推奨になりました。

詳細については、[Kotlin/WasmとJavaScriptの相互運用性](wasm-js-interop.md)ドキュメントを参照してください。

#### 非外部型の制限

Kotlin/Wasmは、JavaScriptとの間で値を渡す際に特定のKotlin静的型の変換をサポートしています。これらのサポートされている型には以下が含まれます。

*   符号付き数値、`Boolean`、`Char`などのプリミティブ型。
*   `String`。
*   関数型。

他の型は不透明な参照として変換なしで渡され、JavaScriptとKotlinのサブタイピングとの間で不整合を引き起こしていました。

これに対処するために、KotlinはJavaScriptの相互運用性を十分にサポートされた型セットに制限します。Kotlin 1.9.0以降、Kotlin/Wasm JavaScript相互運用性では外部型、プリミティブ型、文字列型、関数型のみがサポートされます。さらに、`JsReference`という別の明示的な型が導入され、JavaScriptの相互運用性で使用できるKotlin/Wasmオブジェクトへのハンドルを表します。

詳細については、[Kotlin/WasmとJavaScriptの相互運用性](wasm-js-interop.md)ドキュメントを参照してください。

### Kotlin PlaygroundでのKotlin/Wasm

Kotlin PlaygroundはKotlin/Wasmターゲットをサポートしています。
Kotlin/WasmをターゲットとするKotlinコードを記述、実行、共有できます。[ぜひお試しください！](https://pl.kotl.in/HDFAvimga)

> Kotlin/Wasmを使用するには、ブラウザーで試験的な機能を有効にする必要があります。
>
> [これらの機能を有効にする方法の詳細](wasm-troubleshooting.md)。
>
{style="note"}

```kotlin
import kotlin.time.*
import kotlin.time.measureTime

fun main() {
    println("Hello from Kotlin/Wasm!")
    computeAck(3, 10)
}

tailrec fun ack(m: Int, n: Int): Int = when {
    m == 0 -> n + 1
    n == 0 -> ack(m - 1, 1)
    else -> ack(m - 1, ack(m, n - 1))
}

fun computeAck(m: Int, n: Int) {
    var res = 0
    val t = measureTime {
        res = ack(m, n)
    }
    println()
    println("ack($m, $n) = ${res}")
    println("duration: ${t.inWholeNanoseconds / 1e6} ms")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-whats-new-1-9-0-kotlin-wasm-playground"}

## Kotlin/JS

このリリースでは、古いKotlin/JSコンパイラーの削除、Kotlin/JS Gradleプラグインの非推奨化、ES2015の試験的サポートなど、Kotlin/JSの更新が導入されます。

*   [古いKotlin/JSコンパイラーの削除](#removal-of-the-old-kotlin-js-compiler)
*   [Kotlin/JS Gradleプラグインの非推奨化](#deprecation-of-the-kotlin-js-gradle-plugin)
*   [外部enumの非推奨化](#deprecation-of-external-enum)
*   [ES2015クラスとモジュールの試験的サポート](#experimental-support-for-es2015-classes-and-modules)
*   [JSプロダクションディストリビューションのデフォルト出力先の変更](#changed-default-destination-of-js-production-distribution)
*   [`stdlib-js`から`org.w3c`宣言を抽出](#extract-org-w3c-declarations-from-stdlib-js)

> バージョン1.9.0以降、[部分的なライブラリリンケージ](#library-linkage-in-kotlin-native)もKotlin/JSで有効になります。
>
{style="note"}

### 古いKotlin/JSコンパイラーの削除

Kotlin 1.8.0で、IRベースのバックエンドが[安定版](components-stability.md)になったことを[発表しました](whatsnew18.md#stable-js-ir-compiler-backend)。
それ以降、コンパイラーを指定しないことがエラーになり、古いコンパイラーを使用すると警告が発生します。

Kotlin 1.9.0では、古いバックエンドを使用するとエラーになります。[移行ガイド](js-ir-migration.md)に従ってIRコンパイラーに移行してください。

### Kotlin/JS Gradleプラグインの非推奨化

Kotlin 1.9.0以降、`kotlin-js` Gradleプラグインは非推奨になりました。
代わりに、`js()`ターゲットを持つ`kotlin-multiplatform` Gradleプラグインを使用することをお勧めします。

Kotlin/JS Gradleプラグインの機能は基本的に`kotlin-multiplatform`プラグインと重複しており、内部的には同じ実装を共有していました。この重複は混乱を招き、Kotlinチームのメンテナンス負荷の増加をもたらしました。

移行手順については、[Kotlin Multiplatformの互換性ガイド](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html#migration-from-kotlin-js-gradle-plugin-to-kotlin-multiplatform-gradle-plugin)を参照してください。ガイドでカバーされていない問題を発見した場合は、[課題トラッカー](http://kotl.in/issue)に報告してください。

### 外部enumの非推奨化

Kotlin 1.9.0では、Kotlinの外に存在できない`entries`のような静的enumメンバーに関する問題があるため、外部enumの使用が非推奨になります。代わりに、オブジェクトサブクラスを持つ外部シールドクラスを使用することをお勧めします。

```kotlin
// Before
external enum class ExternalEnum { A, B }

// After
external sealed class ExternalEnum {
    object A: ExternalEnum
    object B: ExternalEnum
}
```
{validate="false"}

オブジェクトサブクラスを持つ外部シールドクラスに切り替えることで、外部enumと同様の機能を実現しつつ、デフォルトメソッドに関連する問題を回避できます。

Kotlin 1.9.0以降、外部enumの使用は非推奨としてマークされます。互換性と将来のメンテナンスのために、推奨される外部シールドクラスの実装を利用するようにコードを更新することをお勧めします。

### ES2015クラスとモジュールの試験的サポート

このリリースでは、ES2015モジュールとES2015クラス生成の[試験的](components-stability.md#stability-levels-explained)サポートが導入されます。
*   モジュールは、コードベースを簡素化し、保守性を向上させる方法を提供します。
*   クラスを使用すると、オブジェクト指向プログラミング（OOP）の原則を組み込むことができ、よりクリーンで直感的なコードになります。

これらの機能を有効にするには、`build.gradle.kts`ファイルを適切に更新してください。

```kotlin
// build.gradle.kts
kotlin {
    js(IR) {
        useEsModules() // Enables ES2015 modules
        browser()
    }
}

// Enables ES2015 classes generation
tasks.withType<KotlinJsCompile>().configureEach {
    kotlinOptions {
        useEsClasses = true
    }
}
```
{validate="false"}

[ES2015（ECMAScript 2015、ES6）について公式ドキュメントで詳細を確認してください](https://262.ecma-international.org/6.0/)。

### JSプロダクションディストリビューションのデフォルト出力先の変更

Kotlin 1.9.0より前は、ディストリビューションのターゲットディレクトリは`build/distributions`でした。しかし、これはGradleアーカイブの一般的なディレクトリです。この問題を解決するため、Kotlin 1.9.0ではデフォルトのディストリビューションターゲットディレクトリを`build/dist/<targetName>/<binaryName>`に変更しました。

例えば、`productionExecutable`は`build/distributions`にありました。Kotlin 1.9.0では、`build/dist/js/productionExecutable`にあります。

> これらのビルドの結果を使用するパイプラインがある場合は、ディレクトリを更新してください。
>
{style="warning"}

### `stdlib-js`から`org.w3c`宣言を抽出

Kotlin 1.9.0以降、`stdlib-js`は`org.w3c`宣言を含まなくなりました。代わりに、これらの宣言は別のGradle依存関係に移動されました。`build.gradle.kts`ファイルにKotlin Multiplatform Gradleプラグインを追加すると、これらの宣言は、標準ライブラリと同様にプロジェクトに自動的に含まれます。

手動での操作や移行は不要です。必要な調整は自動的に処理されます。

## Gradle

Kotlin 1.9.0には、新しいGradleコンパイラーオプションとその他多くの機能が含まれています。

*   [`classpath`プロパティの削除](#removed-classpath-property)
*   [新しいGradleコンパイラーオプション](#new-compiler-options)
*   [Kotlin/JVMのプロジェクトレベルコンパイラーオプション](#project-level-compiler-options-for-kotlin-jvm)
*   [Kotlin/Nativeモジュール名のコンパイラーオプション](#compiler-option-for-kotlin-native-module-name)
*   [公式Kotlinライブラリ用の個別のコンパイラープラグイン](#separate-compiler-plugins-for-official-kotlin-libraries)
*   [最小サポートバージョンの引き上げ](#incremented-minimum-supported-version)
*   [kaptはGradleでEager Task Creationを引き起こしません](#kapt-doesn-t-cause-eager-task-creation-in-gradle)
*   [JVMターゲット検証モードのプログラムによる構成](#programmatic-configuration-of-the-jvm-target-validation-mode)

### `classpath`プロパティの削除

Kotlin 1.7.0で、`KotlinCompile`タスクのプロパティである`classpath`の非推奨化サイクルを開始したことを発表しました。Kotlin 1.8.0では非推奨レベルが`ERROR`に引き上げられました。このリリースで、ついに`classpath`プロパティを削除しました。
すべてのコンパイルタスクは現在、コンパイルに必要なライブラリのリストのために`libraries`入力を使用する必要があります。

### 新しいコンパイラーオプション

Kotlin Gradleプラグインは現在、オプトインとコンパイラーのプログレッシブモードのための新しいプロパティを提供します。

*   新しいAPIをオプトインするには、`optIn`プロパティを使用し、`optIn.set(listOf(a, b, c))`のような文字列リストを渡すことができます。
*   プログレッシブモードを有効にするには、`progressiveMode.set(true)`を使用します。

### Kotlin/JVMのプロジェクトレベルコンパイラーオプション

Kotlin 1.9.0以降、`kotlin`構成ブロック内に新しい`compilerOptions`ブロックが利用可能になりました。

```kotlin
kotlin {
    compilerOptions {
        jvmTarget.set(JVM.Target_11)
    }
}
```
{validate="false"}

これにより、コンパイラーオプションの構成がはるかに簡単になります。しかし、いくつかの重要な詳細に注意することが重要です。

*   この構成はプロジェクトレベルでのみ機能します。
*   Androidプラグインの場合、このブロックは次のオブジェクトと同じものを構成します。

```kotlin
android {
    kotlinOptions {}
}
```
{validate="false"}

*   `android.kotlinOptions`と`kotlin.compilerOptions`構成ブロックは互いにオーバーライドします。ビルドファイル内の最後の（最も低い）ブロックが常に有効になります。
*   `moduleName`がプロジェクトレベルで構成されている場合、コンパイラーに渡されるときにその値が変更される可能性があります。これは`main`コンパイルの場合はそうではありませんが、他のタイプ、例えばテストソースの場合、Kotlin Gradleプラグインは`_test`サフィックスを追加します。
*   `tasks.withType<KotlinJvmCompile>().configureEach {}`（または`tasks.named<KotlinJvmCompile>("compileKotlin") { }`）内の構成は、`kotlin.compilerOptions`と`android.kotlinOptions`の両方をオーバーライドします。

### Kotlin/Nativeモジュール名のコンパイラーオプション

Kotlin/Nativeの[`module-name`](compiler-reference.md#module-name-name-native)コンパイラーオプションは、Kotlin Gradleプラグインで簡単に利用できるようになりました。

このオプションは、コンパイルモジュールの名前を指定し、Objective-Cにエクスポートされる宣言の名前プレフィックスを追加するためにも使用できます。

`compilerOptions`ブロックでモジュール名を直接設定できるようになりました。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.named<org.jetbrains.kotlin.gradle.tasks.KotlinNativeCompile>("compileKotlinLinuxX64") {
    compilerOptions {
        moduleName.set("my-module-name")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.named("compileKotlinLinuxX64", org.jetbrains.kotlin.gradle.tasks.KotlinNativeCompile.class) {
    compilerOptions {
        moduleName = "my-module-name"
    }
}
```

</tab>
</tabs>

### 公式Kotlinライブラリ用の個別のコンパイラープラグイン

Kotlin 1.9.0は、公式ライブラリ用の個別のコンパイラープラグインを導入します。以前は、コンパイラープラグインは対応するGradleプラグインに埋め込まれていました。これは、コンパイラープラグインがGradleビルドのKotlinランタイムバージョンよりも高いKotlinバージョンに対してコンパイルされた場合に互換性の問題を引き起こす可能性がありました。

現在、コンパイラープラグインは個別の依存関係として追加されるため、古いGradleバージョンとの互換性の問題に直面することはなくなります。新しいアプローチのもう1つの大きな利点は、新しいコンパイラープラグインが[Bazel](https://bazel.build/)のような他のビルドシステムで使用できることです。

Maven Centralに現在公開している新しいコンパイラープラグインのリストです。

*   kotlin-atomicfu-compiler-plugin
*   kotlin-allopen-compiler-plugin
*   kotlin-lombok-compiler-plugin
*   kotlin-noarg-compiler-plugin
*   kotlin-sam-with-receiver-compiler-plugin
*   kotlinx-serialization-compiler-plugin

すべてのプラグインには、対応する`-embeddable`があります。例えば、`kotlin-allopen-compiler-plugin-embeddable`は`kotlin-compiler-embeddable`アーティファクトと連携するように設計されており、スクリプトアーティファクトのデフォルトオプションです。

Gradleはこれらのプラグインをコンパイラー引数として追加します。既存のプロジェクトに変更を加える必要はありません。

### 最小サポートバージョンの引き上げ

Kotlin 1.9.0以降、最小サポートAndroid Gradleプラグインバージョンは4.2.2です。

[Kotlin Gradleプラグインと利用可能なGradleバージョンの互換性については、ドキュメント](gradle-configure-project.md#apply-the-plugin)を参照してください。

### kaptはGradleでEager Task Creationを引き起こしません

1.9.0より前は、[kaptコンパイラープラグイン](kapt.md)は、Kotlinコンパイルタスクの構成済みインスタンスを要求することで、Eager Task Creationを引き起こしていました。この動作はKotlin 1.9.0で修正されました。`build.gradle.kts`ファイルのデフォルト構成を使用している場合、この変更による影響は受けません。

> カスタム構成を使用している場合、設定は悪影響を受けます。
> 例えば、Gradleのtasks APIを使用して`KotlinJvmCompile`タスクを変更した場合は、同様にビルドスクリプトの`KaptGenerateStubs`タスクも変更する必要があります。
>
> 例えば、スクリプトに`KotlinJvmCompile`タスクの以下の構成がある場合：
> ```kotlin
> tasks.named<KotlinJvmCompile>("compileKotlin") { // Your custom configuration }
> ```
> {validate="false"}
>
> この場合、同じ変更が`KaptGenerateStubs`タスクの一部として含まれていることを確認する必要があります。
> ```kotlin
> tasks.named<KaptGenerateStubs>("kaptGenerateStubs") { // Your custom configuration }
> ```
> {validate="false"}
>
{style="warning"}

詳細については、[YouTrackチケット](https://youtrack.jetbrains.com/issue/KT-54468/KAPT-Gradle-plugin-causes-eager-task-creation)を参照してください。

### JVMターゲット検証モードのプログラムによる構成

Kotlin 1.9.0より前は、KotlinとJava間のJVMターゲットの非互換性の検出を調整する方法は1つしかありませんでした。プロジェクト全体で`gradle.properties`に`kotlin.jvm.target.validation.mode=ERROR`を設定する必要がありました。

`build.gradle.kts`ファイルでタスクレベルでも設定できるようになりました。

```kotlin
tasks.named<org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile>("compileKotlin") {
    jvmTargetValidationMode.set(org.jetbrains.kotlin.gradle.dsl.jvm.JvmTargetValidationMode.WARNING)
}
```
{validate="false"}

## 標準ライブラリ

Kotlin 1.9.0には、標準ライブラリにいくつかの大きな改善があります。
*   [`..<`演算子](#stable-operator-for-open-ended-ranges)と[時間API](#stable-time-api)は安定版です。
*   [Kotlin/Native標準ライブラリは徹底的にレビューされ、更新されました](#the-kotlin-native-standard-library-s-journey-towards-stabilization)。
*   [`@Volatile`アノテーションはより多くのプラットフォームで使用できます](#stable-volatile-annotation)。
*   [名前で正規表現のキャプチャグループを取得する**共通**関数があります](#new-common-function-to-get-regex-capture-group-by-name)。
*   [16進数をフォーマットおよびパースするために`HexFormat`クラスが導入されました](#new-hexformat-class-to-format-and-parse-hexadecimals)。

### 開区間範囲のための安定した`..<`演算子

[Kotlin 1.7.20](whatsnew1720.md#preview-of-the-operator-for-creating-open-ended-ranges)で導入され、1.8.0で安定版になった開区間範囲のための新しい`..<`演算子。1.9.0では、開区間範囲を扱うための標準ライブラリAPIも安定版です。

私たちの調査によると、新しい`..<`演算子を使用すると、開区間範囲が宣言されたときに理解しやすくなります。[`until`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/until.html)infix関数を使用すると、上限が含まれると誤解しやすいです。

`until`関数を使用した例を以下に示します。

```kotlin
fun main() {
    for (number in 2 until 10) {
        if (number % 2 == 0) {
            print("$number ")
        }
    }
    // 2 4 6 8
}
```
{validate="false"}

新しい`..<`演算子を使用した例を以下に示します。

```kotlin
fun main() {
    for (number in 2..<10) {
        if (number % 2 == 0) {
            print("$number ")
        }
    }
    // 2 4 6 8
}
```
{validate="false"}

> IntelliJ IDEAバージョン2023.1.1以降、`..<`演算子を使用できる箇所をハイライトする新しいコード検査が利用可能です。
>
{style="note"}

この演算子で何ができるかの詳細については、「[Kotlin 1.7.20の新機能](whatsnew1720.md#preview-of-the-operator-for-creating-open-ended-ranges)」を参照してください。

### 安定した時間API

1.3.50以降、新しい時間計測APIのプレビューを提供してきました。APIの期間部分は1.6.0で安定版になりました。1.9.0では、残りの時間計測APIは安定版です。

古い時間APIは`measureTimeMillis`と`measureNanoTime`関数を提供しましたが、これらは直感的に使用できません。両者が異なる単位で時間を測定することは明らかですが、`measureTimeMillis`が[壁時計](https://en.wikipedia.org/wiki/Elapsed_real_time)を使用して時間を測定するのに対し、`measureNanoTime`がモノトニックな時間源を使用することは明らかではありません。新しい時間APIはこれとその他の問題を解決し、APIをよりユーザーフレンドリーにします。

新しい時間APIを使用すると、簡単に以下を行うことができます。
*   モノトニックな時間源を使用して、希望する時間単位でコードの実行にかかる時間を測定する。
*   時刻を記録する。
*   2つの時点を比較し、その差を求める。
*   特定の時点からどれくらいの時間が経過したかを確認する。
*   現在の時間が特定の時点を過ぎたかどうかを確認する。

#### コードの実行時間を測定

コードブロックの実行にかかる時間を測定するには、[`measureTime`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html)インライン関数を使用します。

コードブロックの実行にかかる時間を測定し、**かつ**そのコードブロックの結果を返すには、[`measureTimedValue`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-timed-value.html)インライン関数を使用します。

デフォルトでは、両方の関数はモノトニックな時間源を使用します。しかし、経過実時間源を使用したい場合は可能です。例えば、Androidではデフォルトの時間源である`System.nanoTime()`は、デバイスがアクティブな間のみ時間をカウントします。デバイスがディープスリープに入ると、時間の追跡を失います。デバイスがディープスリープ中も時間を追跡するには、代わりに[`SystemClock.elapsedRealtimeNanos()`](https://developer.android.com/reference/android/os/SystemClock#elapsedRealtimeNanos())を使用する時間源を作成できます。

```kotlin
object RealtimeMonotonicTimeSource : AbstractLongTimeSource(DurationUnit.NANOSECONDS) {
    override fun read(): Long = SystemClock.elapsedRealtimeNanos()
}
```
{validate="false"}

#### 時刻をマークし、その差を測定

特定の時刻をマークするには、[`TimeSource`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/)インターフェースと[`markNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/mark-now.html)関数を使用して[`TimeMark`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/)を作成します。同じ時間源からの`TimeMark`間の差を測定するには、減算演算子（`-`）を使用します。

```kotlin
import kotlin.time.*

fun main() {
    val timeSource = TimeSource.Monotonic
    val mark1 = timeSource.markNow()
    Thread.sleep(500) // Sleep 0.5 seconds.
    val mark2 = timeSource.markNow()

    repeat(4) { n ->
        val mark3 = timeSource.markNow()
        val elapsed1 = mark3 - mark1
        val elapsed2 = mark3 - mark2

        println("Measurement 1.${n + 1}: elapsed1=$elapsed1, elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
    }
    // It's also possible to compare time marks with each other.
    println(mark2 > mark1) // This is true, as mark2 was captured later than mark1.
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-whats-new-time-elapsed"}

期限が過ぎたか、タイムアウトに達したかを確認するには、[`hasPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-passed-now.html)と[`hasNotPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-not-passed-now.html)拡張関数を使用します。

```kotlin
import kotlin.time.*
import kotlin.time.Duration.Companion.seconds

fun main() {
    val timeSource = TimeSource.Monotonic
    val mark1 = timeSource.markNow()
    val fiveSeconds: Duration = 5.seconds
    val mark2 = mark1 + fiveSeconds

    // It hasn't been 5 seconds yet
    println(mark2.hasPassedNow())
    // false

    // Wait six seconds
    Thread.sleep(6000)
    println(mark2.hasPassedNow())
    // true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-whats-new-time-passednow"}

### Kotlin/Native標準ライブラリの安定化への道

Kotlin/Nativeの標準ライブラリが成長を続けるにつれて、その高い基準を満たすことを保証するために、完全なレビューを行う時期が来たと判断しました。これの一環として、既存の**すべての**公開シグネチャを慎重にレビューしました。各シグネチャについて、それが以下であるかどうかを検討しました。

*   独自の目的を持っているか。
*   他のKotlin APIと一貫性があるか。
*   JVMの対応するものと同様の動作をするか。
*   将来性があるか。

これらの考慮事項に基づいて、以下のいずれかの決定を下しました。
*   安定版にした。
*   試験的機能にした。
*   `private`とマークした。
*   その動作を変更した。
*   別の場所に移動した。
*   非推奨にした。
*   廃止とマークした。

> 既存のシグネチャが以下の場合：
> *   別のパッケージに移動された場合、シグネチャは元のパッケージに引き続き存在しますが、非推奨レベル`WARNING`で非推奨になりました。IntelliJ IDEAはコード検査時に自動的に代替を提案します。
> *   非推奨になった場合、非推奨レベル`WARNING`で非推奨になりました。
> *   廃止とマークされた場合、引き続き使用できますが、将来的に置き換えられます。
>
{style="note"}

レビューのすべての結果をここにリストするわけではありませんが、主なハイライトをいくつか紹介します。
*   Atomics APIを安定化しました。
*   [`kotlinx.cinterop`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/)を試験的機能とし、パッケージを使用するために異なるオプトインを要求するようになりました。詳細については、「[明示的なC相互運用性の安定性保証](#explicit-c-interoperability-stability-guarantees)」を参照してください。
*   [`Worker`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker/)クラスとその関連APIを廃止とマークしました。
*   [`BitSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-bit-set/)クラスを廃止とマークしました。
*   `kotlin.native.internal`パッケージのすべての`public` APIを`private`とマークするか、他のパッケージに移動しました。

#### 明示的なC相互運用性の安定性保証

APIの高品質を維持するため、[`kotlinx.cinterop`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/)を試験的機能とすることにしました。`kotlinx.cinterop`は徹底的に試されテストされてきましたが、安定版とするにはまだ改善の余地があります。このAPIを相互運用性のために使用することをお勧めしますが、プロジェクトの特定の領域にその使用を限定するようにしてください。これにより、このAPIを安定版にするために進化させ始めた際に、移行が容易になります。

ポインタなどのCのような外部APIを使用したい場合は、`@OptIn(ExperimentalForeignApi)`でオプトインする必要があります。そうしないと、コードはコンパイルされません。

Objective-C/Swift相互運用性をカバーする`kotlinx.cinterop`の残りの部分を使用するには、`@OptIn(BetaInteropApi)`でオプトインする必要があります。オプトインなしでこのAPIを使用しようとすると、コードはコンパイルされますが、コンパイラーが予期される動作を明確に説明する警告を発生させます。

これらのアノテーションの詳細については、[`Annotations.kt`](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/Interop/Runtime/src/main/kotlin/kotlinx/cinterop/Annotations.kt)のソースコードを参照してください。

このレビューの一環としての**すべて**の変更に関する詳細については、[YouTrackチケット](https://youtrack.jetbrains.com/issue/KT-55765)を参照してください。

フィードバックをお待ちしております！[チケット](https://youtrack.jetbrains.com/issue/KT-57728)にコメントすることで直接フィードバックを提供できます。

### 安定した`@Volatile`アノテーション

`var`プロパティに`@Volatile`をアノテーションすると、バッキングフィールドがマークされ、このフィールドへの読み取りまたは書き込みはアトミックになり、書き込みは常に他のスレッドに可視になります。

1.8.20より前は、[`kotlin.jvm.Volatile`アノテーション](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-volatile/)が共通の標準ライブラリで利用可能でした。しかし、このアノテーションはJVMでのみ有効でした。他のプラットフォームで使用すると無視され、エラーにつながりました。

1.8.20では、JVMとKotlin/Nativeの両方でプレビューできた試験的な共通アノテーション`kotlin.concurrent.Volatile`を導入しました。

1.9.0では、`kotlin.concurrent.Volatile`は安定版です。マルチプラットフォームプロジェクトで`kotlin.jvm.Volatile`を使用している場合は、`kotlin.concurrent.Volatile`への移行をお勧めします。

### 名前で正規表現のキャプチャグループを取得する新しい共通関数

1.9.0より前は、各プラットフォームには、正規表現マッチングから名前で正規表現のキャプチャグループを取得するための独自の拡張機能がありました。しかし、共通関数はありませんでした。標準ライブラリが依然としてJVMターゲット1.6および1.7をサポートしていたため、Kotlin 1.8.0より前は共通関数を持つことができませんでした。

Kotlin 1.8.0以降、標準ライブラリはJVMターゲット1.8でコンパイルされます。そのため、1.9.0では、正規表現マッチングで名前によってグループの内容を取得するために使用できる**共通**[`groups`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-match-result/groups.html)関数が利用できるようになりました。これは、特定のキャプチャグループに属する正規表現マッチングの結果にアクセスしたい場合に役立ちます。

`city`、`state`、`areaCode`の3つのキャプチャグループを含む正規表現の例を以下に示します。これらのグループ名を使用して、マッチした値にアクセスできます。

```kotlin
fun main() {
    val regex = """\b(?<city>[A-Za-z\s]+),\s(?<state>[A-Z]{2}):\s(?<areaCode>[0-9]{3})\b""".toRegex()
    val input = "Coordinates: Austin, TX: 123"
    
    val match = regex.find(input)!!
    println(match.groups["city"]?.value)
    // Austin
    println(match.groups["state"]?.value)
    // TX
    println(match.groups["areaCode"]?.value)
    // 123
}
```
{validate="false"}

### 親ディレクトリを作成する新しいパスユーティリティ

1.9.0では、必要なすべての親ディレクトリを持つ新しいファイルを作成するために使用できる新しい`createParentDirectories()`拡張関数が追加されました。`createParentDirectories()`にファイルパスを提供すると、親ディレクトリが既に存在するかどうかを確認します。存在する場合は何もせず、存在しない場合は、それらを作成します。

`createParentDirectories()`は、ファイルをコピーする際に特に便利です。例えば、`copyToRecursively()`関数と組み合わせて使用できます。

 ```kotlin
sourcePath.copyToRecursively(
    destinationPath.createParentDirectories(), 
    followLinks = false
 )
 ```
{validate="false"}

### 16進数をフォーマットおよびパースするための新しいHexFormatクラス

> 新しい`HexFormat`クラスとその関連拡張関数は[試験的](components-stability.md#stability-levels-explained)であり、使用するには`@OptIn(ExperimentalStdlibApi::class)`またはコンパイラー引数`-opt-in=kotlin.ExperimentalStdlibApi`でオプトインする必要があります。
>
{style="warning"}

1.9.0では、[`HexFormat`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/)クラスとその関連拡張関数が試験的機能として提供され、数値と16進文字列の間で変換できます。具体的には、拡張関数を使用して、16進文字列と`ByteArray`または他の数値型（`Int`、`Short`、`Long`）の間で変換できます。

例えば：

```kotlin
println(93.toHexString()) // "0000005d"
```
{validate="false"}

`HexFormat`クラスには、`HexFormat{}`ビルダーで構成できる書式設定オプションが含まれています。

`ByteArray`を扱っている場合、プロパティで構成できる以下のオプションがあります。

| オプション | 説明 |
|--|--|
| `upperCase` | 16進数が大文字か小文字か。デフォルトでは小文字が想定されます。`upperCase = false`。 |
| `bytes.bytesPerLine` | 1行あたりの最大バイト数。 |
| `bytes.bytesPerGroup` | 1グループあたりの最大バイト数。 |
| `bytes.bytesSeparator` | バイト間の区切り文字。デフォルトではなし。 |
| `bytes.bytesPrefix` | 各バイトの2桁の16進表現の直前に置かれる文字列。デフォルトではなし。 |
| `bytes.bytesSuffix` | 各バイトの2桁の16進表現の直後に置かれる文字列。デフォルトではなし。 |

例えば：

```kotlin
val macAddress = "001b638445e6".hexToByteArray()

// HexFormat{}ビルダーを使用して16進文字列をコロンで区切る
println(macAddress.toHexString(HexFormat { bytes.byteSeparator = ":" }))
// "00:1b:63:84:45:e6"

// HexFormat{}ビルダーを使用して：
// * 16進文字列を大文字にする
// * バイトをペアでグループ化する
// * ピリオドで区切る
val threeGroupFormat = HexFormat { upperCase = true; bytes.bytesPerGroup = 2; bytes.groupSeparator = "." }

println(macAddress.toHexString(threeGroupFormat))
// "001B.6384.45E6"
```
{validate="false"}

数値型を扱っている場合、プロパティで構成できる以下のオプションがあります。

| オプション | 説明 |
|--|--|
| `number.prefix` | 16進文字列のプレフィックス。デフォルトではなし。 |
| `number.suffix` | 16進文字列のサフィックス。デフォルトではなし。 |
| `number.removeLeadingZeros` | 16進文字列の先頭のゼロを削除するかどうか。デフォルトでは先頭のゼロは削除されません。`number.removeLeadingZeros = false` |

例えば：

```kotlin
// HexFormat{}ビルダーを使用して、プレフィックス「0x」を持つ16進数をパースする。
println("0x3a".hexToInt(HexFormat { number.prefix = "0x" })) // "58"
```
{validate="false"}

## ドキュメントの更新

Kotlinドキュメントにいくつかの注目すべき変更が加えられました。
*   [Kotlinツアー](kotlin-tour-welcome.md) – 理論と実践の両方を含む章でKotlinプログラミング言語の基本を学びます。
*   [Androidソースセットレイアウト](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-android-layout.html) – 新しいAndroidソースセットレイアウトについて学びます。
*   [Kotlin Multiplatformの互換性ガイド](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html) – Kotlin Multiplatformでプロジェクトを開発する際に遭遇する可能性のある互換性のない変更について学びます。
*   [Kotlin Wasm](wasm-overview.md) – Kotlin/Wasmについて、そしてKotlin Multiplatformプロジェクトでどのように使用できるかについて学びます。

## Kotlin 1.9.0のインストール

### IDEバージョンの確認

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2022.3.3および2023.1.1は、Kotlinプラグインをバージョン1.9.0に更新することを自動的に提案します。IntelliJ IDEA 2023.2には、Kotlin 1.9.0プラグインが含まれる予定です。

Android Studio Giraffe (223)およびHedgehog (231)は、今後のリリースでKotlin 1.9.0をサポートします。

新しいコマンドラインコンパイラーは、[GitHubリリースページ](https://github.com/JetBrains/kotlin/releases/tag/v1.9.0)でダウンロードできます。

### Gradle設定の構成

Kotlinのアーティファクトと依存関係をダウンロードするには、Maven Central Repositoryを使用するように`settings.gradle(.kts)`ファイルを更新してください。

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```
{validate="false"}

リポジトリが指定されていない場合、Gradleは廃止されたJCenterリポジトリを使用し、これによりKotlinアーティファクトで問題が発生する可能性があります。

## Kotlin 1.9.0の互換性ガイド

Kotlin 1.9.0は[機能リリース](kotlin-evolution-principles.md#language-and-tooling-releases)であり、そのため、以前のバージョンの言語用に書かれたコードとの互換性のない変更をもたらす可能性があります。これらの変更の詳細なリストは、[Kotlin 1.9.0の互換性ガイド](compatibility-guide-19.md)で確認してください。