[//]: # (title: Kotlin 1.9.0の新機能)

_[リリース日: 2023年7月6日](releases.md#release-details)_

Kotlin 1.9.0がリリースされ、JVM向けK2コンパイラが**ベータ版**になりました。その他、主なハイライトは以下のとおりです。

*   [Kotlin K2コンパイラの新しい更新](#new-kotlin-k2-compiler-updates)
*   [enumクラスの`values`関数の安定版の代替機能](#stable-replacement-of-the-enum-class-values-function)
*   [オープンエンドレンジの安定版`..<`演算子](#stable-operator-for-open-ended-ranges)
*   [正規表現キャプチャグループを名前で取得する新しい共通関数](#new-common-function-to-get-regex-capture-group-by-name)
*   [親ディレクトリを作成する新しいパスユーティリティ](#new-path-utility-to-create-parent-directories)
*   [Kotlin MultiplatformにおけるGradle構成キャッシュのプレビュー](#preview-of-the-gradle-configuration-cache)
*   [Kotlin MultiplatformにおけるAndroidターゲットサポートの変更](#changes-to-android-target-support)
*   [Kotlin/Nativeにおけるカスタムメモリ割り当て機能のプレビュー](#preview-of-custom-memory-allocator)
*   [Kotlin/Nativeにおけるライブラリのリンク](#library-linkage-in-kotlin-native)
*   [Kotlin/Wasmにおけるサイズ関連の最適化](#size-related-optimizations)

これらの更新の簡単な概要を以下のビデオでご覧いただけます。

<video src="https://www.youtube.com/v/fvwTZc-dxsM" title="What's new in Kotlin 1.9.0"/>

## IDEサポート

1.9.0をサポートするKotlinプラグインは、以下のIDEで利用可能です。

| IDE | サポートバージョン |
|---|---|
| IntelliJ IDEA | 2022.3.x, 2023.1.x |
| Android Studio | Giraffe (223), Hedgehog (231)* |

*Kotlin 1.9.0プラグインは、Android Studio Giraffe (223) および Hedgehog (231) の今後のリリースに含まれます。

Kotlin 1.9.0プラグインは、今後のIntelliJ IDEA 2023.2のリリースに含まれます。

> Kotlinのアーティファクトと依存関係をダウンロードするには、[Gradle設定を構成して](#configure-gradle-settings)Maven Central Repositoryを使用してください。
>
{style="warning"}

## Kotlin K2コンパイラの新しい更新

JetBrainsのKotlinチームはK2コンパイラの安定化を続けており、1.9.0リリースではさらなる進歩が導入されました。
JVM向けK2コンパイラは現在**ベータ版**です。

Kotlin/Nativeおよびマルチプラットフォームプロジェクトの基本的なサポートも追加されました。

### kaptコンパイラプラグインとK2コンパイラの互換性

[kaptプラグイン](kapt.md)はK2コンパイラとともにプロジェクトで使用できますが、いくつかの制限があります。
`languageVersion`を`2.0`に設定しても、kaptコンパイラプラグインは引き続き古いコンパイラを利用します。

`languageVersion`が`2.0`に設定されているプロジェクトでkaptコンパイラプラグインを実行すると、kaptは自動的に`1.9`に切り替わり、特定のバージョン互換性チェックを無効にします。この動作は、以下のコマンド引数を含めることと同じです。
*   `-Xskip-metadata-version-check`
*   `-Xskip-prerelease-check`
*   `-Xallow-unstable-dependencies`

これらのチェックはkaptタスクに対してのみ無効化されます。他のすべてのコンパイルタスクは引き続き新しいK2コンパイラを利用します。

K2コンパイラでkaptを使用する際に問題が発生した場合は、[課題トラッカー](http://kotl.in/issue)に報告してください。

### プロジェクトでK2コンパイラを試す

1.9.0以降、Kotlin 2.0のリリースまでは、`gradle.properties`ファイルに`kotlin.experimental.tryK2=true`
Gradleプロパティを追加することで、簡単にK2コンパイラをテストできます。以下のコマンドを実行することもできます。

```shell
./gradlew assemble -Pkotlin.experimental.tryK2=true
```

このGradleプロパティは、言語バージョンを自動的に2.0に設定し、ビルドレポートをK2コンパイラを使用してコンパイルされたKotlinタスクの数と現在のコンパイラを使用してコンパイルされたタスクの数で更新します。

```none
##### 'kotlin.experimental.tryK2' results (Kotlin/Native not checked) #####
:lib:compileKotlin: 2.0 language version
:app:compileKotlin: 2.0 language version
##### 100% (2/2) tasks have been compiled with Kotlin 2.0 #####
```

### Gradleビルドレポート

[Gradleビルドレポート](gradle-compilation-and-caches.md#build-reports)は、コードのコンパイルに現在のコンパイラまたはK2コンパイラが使用されたかどうかを示すようになりました。Kotlin 1.9.0では、この情報を[Gradleビルドスキャン](https://scans.gradle.com/)で確認できます。

![Gradle build scan - K1](gradle-build-scan-k1.png){width=700}

![Gradle build scan - K2](gradle-build-scan-k2.png){width=700}

プロジェクトで使用されているKotlinのバージョンは、ビルドレポートで直接確認することもできます。

```none
Task info:
  Kotlin language version: 1.9
```

> Gradle 8.0を使用している場合、特にGradle構成キャッシュが有効になっていると、ビルドレポートで問題が発生する可能性があります。これは既知の問題であり、Gradle 8.1以降で修正されています。
>
{style="note"}

### 現在のK2コンパイラの制限

GradleプロジェクトでK2を有効にすると、特定の制限が伴います。これらの制限は、Gradleバージョン8.3より前のプロジェクトで、以下のケースに影響を与える可能性があります。

*   `buildSrc`からのソースコードのコンパイル。
*   インクルードされたビルド内のGradleプラグインのコンパイル。
*   Gradleバージョン8.3より前のプロジェクトで使用されている他のGradleプラグインのコンパイル。
*   Gradleプラグインの依存関係のビルド。

上記の問題に遭遇した場合は、以下の手順で対処できます。

*   `buildSrc`、任意のGradleプラグイン、およびその依存関係の言語バージョンを設定します。

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
        apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
    }
}
```

*   プロジェクトのGradleバージョンを8.3（利用可能になり次第）に更新します。

### 新しいK2コンパイラに関するフィードバック

皆様からのフィードバックをお待ちしております！

*   K2開発者に直接フィードバックを提供するには、KotlinのSlackで[招待を受け取り](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)、[#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257)チャンネルに参加してください。
*   新しいK2コンパイラで直面した問題は、[課題トラッカー](https://kotl.in/issue)に報告してください。
*   [**利用状況統計の送信**オプションを有効にして](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)、JetBrainsがK2の利用に関する匿名データを収集できるようにしてください。

## 言語

Kotlin 1.9.0では、以前に導入されたいくつかの新言語機能を安定化しています。
*   [enumクラスの`values`関数の代替機能](#stable-replacement-of-the-enum-class-values-function)
*   [データクラスとの対称性のためのデータオブジェクト](#stable-data-objects-for-symmetry-with-data-classes)
*   [インライン値クラスにおける本体を持つセカンダリコンストラクタのサポート](#support-for-secondary-constructors-with-bodies-in-inline-value-classes)

### enumクラスの`values`関数の安定版の代替機能

1.8.20で、enumクラスの`entries`プロパティが実験的機能として導入されました。`entries`プロパティは、合成関数`values()`の現代的でパフォーマンスの高い代替機能です。1.9.0では、`entries`プロパティは安定版になりました。

> `values()`関数は引き続きサポートされますが、代わりに`entries`プロパティを使用することをお勧めします。
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

### データクラスとの対称性のためのデータオブジェクトの安定化

[Kotlin 1.8.20](whatsnew1820.md#preview-of-data-objects-for-symmetry-with-data-classes)で導入されたデータオブジェクト宣言が安定版になりました。これには、データクラスとの対称性のために追加された関数である`toString()`、`equals()`、`hashCode()`も含まれます。

この機能は、`sealed`階層（`sealed class`や`sealed interface`階層など）で特に有用です。なぜなら、`data object`宣言は`data class`宣言と組み合わせて便利に使用できるためです。この例では、`EndOfFile`を通常の`object`ではなく`data object`として宣言することで、手動でオーバーライドする必要なく自動的に`toString()`関数を持つことができます。これにより、付随するデータクラス定義との対称性が維持されます。

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

### インライン値クラスにおける本体を持つセカンダリコンストラクタのサポート

Kotlin 1.9.0以降、[インライン値クラス](inline-classes.md)での本体を持つセカンダリコンストラクタの使用がデフォルトで利用可能になりました。

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

以前は、Kotlinはインラインクラスでパブリックなプライマリコンストラクタのみを許可していました。その結果、基になる値をカプセル化したり、制約のある値を表現するインラインクラスを作成したりすることができませんでした。

Kotlinの発展に伴い、これらの問題は修正されました。Kotlin 1.4.30では`init`ブロックの制限が解除され、その後Kotlin 1.8.20では本体を持つセカンダリコンストラクタのプレビューが導入されました。これらは現在デフォルトで利用可能です。Kotlinインラインクラスの発展については、[このKEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md)で詳細を確認してください。

## Kotlin/JVM

バージョン1.9.0以降、コンパイラはJVM 20に対応するバイトコードバージョンでクラスを生成できます。さらに、`JvmDefault`アノテーションと従来の`-Xjvm-default`モードの非推奨化が継続されます。

### JvmDefaultアノテーションと従来の-Xjvm-defaultモードの非推奨化

Kotlin 1.5以降、`JvmDefault`アノテーションの使用は、新しい`-Xjvm-default`モードである`all`および`all-compatibility`に置き換えられ、非推奨となりました。Kotlin 1.4で`JvmDefaultWithoutCompatibility`、Kotlin 1.6で`JvmDefaultWithCompatibility`が導入されたことで、これらのモードは`DefaultImpls`クラスの生成を包括的に制御し、古いKotlinコードとのシームレスな互換性を確保します。

その結果、Kotlin 1.9.0では、`JvmDefault`アノテーションはもはや意味を持たず、非推奨としてマークされ、エラーになります。最終的にはKotlinから削除されます。

## Kotlin/Native

このリリースでは、その他の改善に加えて、[Kotlin/Nativeメモリマネージャー](native-memory-manager.md)のさらなる進歩がもたらされ、その堅牢性とパフォーマンスが向上するはずです。

*   [カスタムメモリ割り当て機能のプレビュー](#preview-of-custom-memory-allocator)
*   [メインスレッドでのObjective-CまたはSwiftオブジェクトのデアロケーションフック](#objective-c-or-swift-object-deallocation-hook-on-the-main-thread)
*   [Kotlin/Nativeでの定数値アクセス時のオブジェクト初期化なし](#no-object-initialization-when-accessing-constant-values-in-kotlin-native)
*   [iOSシミュレータテストのスタンドアローンモード設定機能](#ability-to-configure-standalone-mode-for-ios-simulator-tests-in-kotlin-native)
*   [Kotlin/Nativeにおけるライブラリのリンク](#library-linkage-in-kotlin-native)

### カスタムメモリ割り当て機能のプレビュー

Kotlin 1.9.0では、カスタムメモリ割り当て機能のプレビューが導入されました。その割り当てシステムは、[Kotlin/Nativeメモリマネージャー](native-memory-manager.md)のランタイムパフォーマンスを向上させます。

Kotlin/Nativeの現在のオブジェクト割り当てシステムは、効率的なガベージコレクションの機能を持たない汎用アロケーターを使用しています。これを補うために、ガベージコレクター (GC) がそれらを単一のリストにマージする前に、すべての割り当て済みオブジェクトのスレッドローカルな連結リストを維持し、スイープ中に反復することができます。このアプローチには、いくつかのパフォーマンス上の欠点があります。

*   スイープ順序にはメモリ局所性がなく、しばしば散発的なメモリアクセスパターンを引き起こし、潜在的なパフォーマンス問題につながります。
*   連結リストは各オブジェクトに追加のメモリを必要とし、特に多くの小さなオブジェクトを扱う場合にメモリ使用量が増加します。
*   割り当て済みオブジェクトの単一リストでは、スイープの並列化が困難であり、ミューテーターのスレッドがGCスレッドよりも速くオブジェクトを割り当てる場合にメモリ使用量の問題を引き起こす可能性があります。

これらの問題を解決するために、Kotlin 1.9.0ではカスタムアロケーターのプレビューが導入されました。これはシステムメモリをページに分割し、連続した順序で独立したスイープを可能にします。各割り当てはページ内のメモリブロックとなり、ページはブロックサイズを追跡します。異なるページタイプは、さまざまな割り当てサイズに最適化されています。メモリブロックの連続した配置により、すべての割り当て済みブロックを効率的に反復できます。

スレッドがメモリを割り当てる際、割り当てサイズに基づいて適切なページを検索します。スレッドは、異なるサイズのカテゴリに対応するページのセットを維持します。通常、特定のサイズの現在のページは割り当てを収容できます。そうでない場合、スレッドは共有割り当てスペースから別のページを要求します。このページはすでに利用可能であるか、スイープが必要であるか、または最初に作成する必要があります。

新しいアロケーターでは、複数の独立した割り当て空間を同時に持つことができ、Kotlinチームはさまざまなページレイアウトを試してパフォーマンスをさらに向上させることができます。

新しいアロケーターの設計に関する詳細については、この[README](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)を参照してください。

#### 有効化方法

`-Xallocator=custom`コンパイラオプションを追加します。

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

#### フィードバックの提供

カスタムアロケーターを改善するために、[YouTrack](https://youtrack.jetbrains.com/issue/KT-55364/Implement-custom-allocator-for-Kotlin-Native)でフィードバックをお寄せください。

### メインスレッドでのObjective-CまたはSwiftオブジェクトのデアロケーションフック

Kotlin 1.9.0以降、Objective-CまたはSwiftオブジェクトがメインスレッドにKotlinに渡された場合、そのデアロケーションフックはメインスレッドで呼び出されます。[Kotlin/Nativeメモリマネージャー](native-memory-manager.md)が以前Objective-Cオブジェクトへの参照を処理する方法は、メモリリークにつながる可能性がありました。この新しい動作により、メモリマネージャーの堅牢性が向上すると考えられます。

Objective-CオブジェクトがKotlinコード内で参照されている場合、例えば引数として渡されたり、関数から返されたり、コレクションから取得されたりする場合を考えます。この場合、KotlinはObjective-Cオブジェクトへの参照を保持する独自のオブジェクトを作成します。Kotlinオブジェクトがデアロケートされると、Kotlin/Nativeランタイムは`objc_release`関数を呼び出し、Objective-C参照を解放します。

以前は、Kotlin/Nativeメモリマネージャーは`objc_release`を特殊なGCスレッドで実行していました。最後のオブジェクト参照の場合、オブジェクトはデアロケートされます。Objective-Cオブジェクトが`dealloc`メソッド（Objective-C）や`deinit`ブロック（Swift）などのカスタムデアロケーションフックを持ち、これらのフックが特定の`thread`で呼び出されることを期待している場合に問題が発生する可能性がありました。

メインスレッド上のオブジェクトのフックは通常そこで呼び出されることを期待するため、Kotlin/Nativeランタイムは`objc_release`もメインスレッドで呼び出すようになりました。これは、Objective-CオブジェクトがメインスレッドでKotlinに渡され、そこでKotlinピアオブジェクトが作成されたケースをカバーするはずです。これは、通常のUIアプリケーションの場合のように、メインディスパッチキューが処理されている場合にのみ機能します。メインキューではない場合、またはオブジェクトがメイン以外のスレッドでKotlinに渡された場合、`objc_release`は以前と同様に特殊なGCスレッドで呼び出されます。

#### オプトアウト方法

問題が発生した場合は、`gradle.properties`ファイルで以下のオプションを使用してこの動作を無効にできます。

```none
kotlin.native.binary.objcDisposeOnMain=false
```

このようなケースは、[課題トラッカー](https://kotl.in/issue)に報告することをためらわないでください。

### Kotlin/Nativeでの定数値アクセス時のオブジェクト初期化なし

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

この動作は現在Kotlin/JVMと統一されており、Javaと一貫した実装で、この場合はオブジェクトは決して初期化されません。この変更により、Kotlin/Nativeプロジェクトでパフォーマンスの向上が期待できます。

### iOSシミュレータテストのスタンドアローンモード設定機能

デフォルトでは、Kotlin/NativeのiOSシミュレータテストを実行する際、手動でのシミュレータの起動とシャットダウンを避けるために`--standalone`フラグが使用されます。1.9.0では、このフラグがGradleタスクで`standalone`プロパティを通じて使用されるかどうかを設定できるようになりました。デフォルトでは`--standalone`フラグが使用されるため、スタンドアローンモードは有効になっています。

`build.gradle.kts`ファイルでスタンドアローンモードを無効にする例を以下に示します。

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.targets.native.tasks.KotlinNativeSimulatorTest>().configureEach {
    standalone.set(false)
}
```
{validate="false"}

> スタンドアローンモードを無効にする場合、シミュレータを手動で起動する必要があります。CLIからシミュレータを起動するには、以下のコマンドを使用します。
>
> ```shell
> /usr/bin/xcrun simctl boot <DeviceId>
> ```
>
{style="warning"}

### Kotlin/Nativeにおけるライブラリのリンク

Kotlin 1.9.0以降、Kotlin/NativeコンパイラはKotlinライブラリ内のリンケージの問題をKotlin/JVMと同様に扱います。これは、あるサードパーティのKotlinライブラリの作者が、別のサードパーティのKotlinライブラリが消費する実験的APIに互換性のない変更を加えた場合に、そのような問題に直面する可能性があります。

現在、サードパーティのKotlinライブラリ間のリンケージの問題がある場合でも、ビルドはコンパイル中に失敗しません。代わりに、JVMとまったく同じように、これらのエラーは実行時にのみ発生します。

Kotlin/Nativeコンパイラは、ライブラリのリンケージに関する問題を検出するたびに警告を報告します。これらの警告は、コンパイルログで確認できます。

```text
No function found for symbol 'org.samples/MyRemovedClass.doSomething|3657632771909858561[0]'

Can not get instance of singleton 'MyEnumClass.REMOVED_ENTRY': No enum entry found for symbol 'org.samples/MyEnumClass.REMOVED_ENTRY|null[0]'

Function 'getMyRemovedClass' can not be called: Function uses unlinked class symbol 'org.samples/MyRemovedClass|null[0]'
```

これらの動作をプロジェクトでさらに設定したり、無効にしたりできます。

*   コンパイルログにこれらの警告を表示したくない場合は、`-Xpartial-linkage-loglevel=INFO`コンパイラオプションで抑制します。
*   報告された警告の重大度を`-Xpartial-linkage-loglevel=ERROR`でコンパイルエラーに引き上げることも可能です。この場合、コンパイルは失敗し、すべてのエラーがコンパイルログに表示されます。このオプションを使用して、リンケージの問題をより詳細に調べます。
*   この機能で予期せぬ問題が発生した場合は、`-Xpartial-linkage=disable`コンパイラオプションでいつでもオプトアウトできます。このようなケースは、[課題トラッカー](https://kotl.in/issue)に報告することをためらわないでください。

```kotlin
// An example of passing compiler options via Gradle build file.
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {
                // To suppress linkage warnings:
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=INFO")

                // To raise linkage warnings to errors:
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=ERROR")

                // To disable the feature completely:
                freeCompilerArgs.add("-Xpartial-linkage=disable")
            }
        }
    }
}
```
{validate="false"}

### C interopにおける暗黙的な整数変換のコンパイラオプション

C interopで暗黙的な整数変換を使用できるようにするコンパイラオプションが導入されました。慎重な検討の結果、この機能にはまだ改善の余地があり、最高品質のAPIを目指しているため、意図しない使用を防ぐためにこのコンパイラオプションが導入されました。

このコードサンプルでは、`options = 0`が許可されていますが、[`options`](https://developer.apple.com/documentation/foundation/nscalendar/options)が符号なし型`UInt`で、`0`が符号ありであるにもかかわらず、暗黙的な整数変換が許可されています。

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

ネイティブインターロップライブラリで暗黙的な変換を使用するには、`-XXLanguage:+ImplicitSignedToUnsignedIntegerConversion`コンパイラオプションを使用します。

これはGradleの`build.gradle.kts`ファイルで設定できます。
```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinNativeCompile>().configureEach {
    compilerOptions.freeCompilerArgs.addAll(
        "-XXLanguage:+ImplicitSignedToUnsignedIntegerConversion"
    )
}
```
{validate="false"}

## Kotlin Multiplatform

Kotlin Multiplatformは、開発者エクスペリエンスを向上させるために設計されたいくつかの注目すべきアップデートを1.9.0で受けました。

*   [Androidターゲットサポートの変更](#changes-to-android-target-support)
*   [新しいAndroidソースセットレイアウトがデフォルトで有効に](#new-android-source-set-layout-enabled-by-default)
*   [マルチプラットフォームプロジェクトにおけるGradle構成キャッシュのプレビュー](#preview-of-the-gradle-configuration-cache)

### Androidターゲットサポートの変更

Kotlin Multiplatformの安定化に向けた取り組みを継続しています。重要な一歩は、Androidターゲットに対するファーストクラスのサポートを提供することです。将来的には、GoogleのAndroidチームがKotlin MultiplatformでAndroidをサポートするための独自のGradleプラグインを提供することを発表できることを嬉しく思います。

Googleからのこの新しいソリューションへの道を開くために、現在のKotlin DSLにおける`android`ブロックの名前を1.9.0で変更しています。ビルドスクリプト内の`android`ブロックのすべての出現箇所を`androidTarget`に変更してください。これはGoogleからの今後のDSLのために`android`という名前を解放するために必要な一時的な変更です。

Googleのプラグインは、マルチプラットフォームプロジェクトでAndroidを扱う際の推奨される方法となるでしょう。準備が整い次第、必要なマイグレーション手順を提供し、以前と同じように短い`android`名を使用できるようになります。

### 新しいAndroidソースセットレイアウトがデフォルトで有効に

Kotlin 1.9.0以降、新しいAndroidソースセットレイアウトがデフォルトになりました。これは、以前の複数の点で混乱を招いていたディレクトリ命名スキームに代わるものです。新しいレイアウトにはいくつかの利点があります。

*   簡素化されたタイプセマンティクス – 新しいAndroidソースレイアウトは、異なるタイプのソースセットを区別するのに役立つ、明確で一貫性のある命名規則を提供します。
*   改善されたソースディレクトリレイアウト – 新しいレイアウトにより、`SourceDirectories`の配置がより一貫性のあるものになり、コードの整理とソースファイルの特定が容易になります。
*   Gradle構成の明確な命名スキーム – スキーマは`KotlinSourceSets`と`AndroidSourceSets`の両方でより一貫性があり、予測可能になりました。

新しいレイアウトには、Android Gradleプラグインバージョン7.0以降が必要であり、Android Studio 2022.3以降でサポートされています。`build.gradle(.kts)`ファイルに必要な変更を加えるには、[マイグレーションガイド](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-android-layout.html)を参照してください。

### Gradle構成キャッシュのプレビュー

<anchor name="preview-of-gradle-configuration-cache"/>

Kotlin 1.9.0には、マルチプラットフォームライブラリにおける[Gradle構成キャッシュ](https://docs.gradle.org/current/userguide/configuration_cache.html)のサポートが含まれています。ライブラリの作成者であれば、すでにビルドパフォーマンスの向上から恩恵を受けることができます。

Gradle構成キャッシュは、設定フェーズの結果を後続のビルドで再利用することで、ビルドプロセスを高速化します。この機能はGradle 8.1以降で安定版となりました。有効にするには、[Gradleドキュメント](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)の指示に従ってください。

> Kotlin Multiplatformプラグインは、Xcode統合タスクや[Kotlin CocoaPods Gradleプラグイン](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-dsl-reference.html)では、まだGradle構成キャッシュをサポートしていません。この機能は今後のKotlinリリースで追加される予定です。
>
{style="note"}

## Kotlin/Wasm

Kotlinチームは、新しいKotlin/Wasmターゲットの実験を続けています。このリリースでは、いくつかのパフォーマンスと[サイズ関連の最適化](#size-related-optimizations)に加え、[JavaScript interopの更新](#updates-in-javascript-interop)が導入されています。

### サイズ関連の最適化

Kotlin 1.9.0では、WebAssembly (Wasm) プロジェクト向けの重要なサイズ改善が導入されています。「Hello World」プロジェクトを比較すると、Kotlin 1.9.0におけるWasmのコードフットプリントは、Kotlin 1.8.20と比較して10分の1以下になりました。

![Kotlin/Wasm size-related optimizations](wasm-1-9-0-size-improvements.png){width=700}

これらのサイズ最適化により、WasmプラットフォームをKotlinコードでターゲットとする際の、より効率的なリソース利用とパフォーマンスの向上が実現されます。

### JavaScript interopの更新

このKotlinのアップデートでは、Kotlin/WasmにおけるKotlinとJavaScript間の相互運用性に変更が加えられています。Kotlin/Wasmは[実験的](components-stability.md#stability-levels-explained)機能であるため、その相互運用性には特定の制限が適用されます。

#### Dynamic型に対する制限

バージョン1.9.0以降、Kotlin/Wasmでは`Dynamic`型の使用がサポートされなくなりました。これは、JavaScriptの相互運用性を容易にする新しい汎用`JsAny`型に置き換えられ、非推奨となりました。

詳細については、[Kotlin/WasmとJavaScriptの相互運用性](wasm-js-interop.md)のドキュメントを参照してください。

#### 非外部型に対する制限

Kotlin/Wasmは、値をJavaScriptに渡したりJavaScriptから受け取ったりする際に、特定のKotlin静的型の変換をサポートしています。これらのサポートされる型は以下のとおりです。

*   符号付き数値、`Boolean`、`Char`などのプリミティブ型。
*   `String`。
*   関数型。

他の型は変換されずに不透明な参照として渡され、JavaScriptとKotlinのサブタイピング間で不整合が生じていました。

この問題に対処するため、KotlinはJavaScript interopを十分にサポートされている型のセットに制限します。Kotlin 1.9.0以降、Kotlin/Wasm JavaScript interopでは、外部型、プリミティブ型、文字列型、および関数型のみがサポートされます。さらに、JavaScript interopで使用できるKotlin/Wasmオブジェクトへのハンドルを表すための、`JsReference`という個別の明示的な型が導入されました。

詳細については、[Kotlin/WasmとJavaScriptの相互運用性](wasm-js-interop.md)のドキュメントを参照してください。

### Kotlin/Wasm in Kotlin Playground

Kotlin PlaygroundはKotlin/Wasmターゲットをサポートしています。
Kotlin/WasmをターゲットとするKotlinコードを記述、実行、共有できます。[ぜひお試しください！](https://pl.kotl.in/HDFAvimga)

> Kotlin/Wasmを使用するには、ブラウザで実験的機能を有効にする必要があります。
>
> [これらの機能を有効にする方法について詳しくはこちらをご覧ください](wasm-configuration.md)。
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

このリリースでは、Kotlin/JSの更新が含まれており、古いKotlin/JSコンパイラの削除、Kotlin/JS Gradleプラグインの非推奨化、ES2015の実験的サポートなどがあります。

*   [古いKotlin/JSコンパイラの削除](#removal-of-the-old-kotlin-js-compiler)
*   [Kotlin/JS Gradleプラグインの非推奨化](#deprecation-of-the-kotlin-js-gradle-plugin)
*   [外部enumの非推奨化](#deprecation-of-external-enum)
*   [ES2015クラスとモジュールの実験的サポート](#experimental-support-for-es2015-classes-and-modules)
*   [JSプロダクション配布のデフォルトの保存先変更](#changed-default-destination-of-js-production-distribution)
*   [`org.w3c`宣言の`stdlib-js`からの抽出](#extract-org-w3c-declarations-from-stdlib-js)

> バージョン1.9.0以降、[部分的なライブラリリンケージ](#library-linkage-in-kotlin-native)もKotlin/JSで有効になります。
>
{style="note"}

### 古いKotlin/JSコンパイラの削除

Kotlin 1.8.0では、IRベースのバックエンドが[安定版](components-stability.md)になったことを[発表しました](whatsnew18.md#stable-js-ir-compiler-backend)。
それ以来、コンパイラを指定しないことがエラーとなり、古いコンパイラを使用すると警告が表示されるようになりました。

Kotlin 1.9.0では、古いバックエンドを使用するとエラーになります。[マイグレーションガイド](js-ir-migration.md)に従ってIRコンパイラに移行してください。

### Kotlin/JS Gradleプラグインの非推奨化

Kotlin 1.9.0以降、`kotlin-js` Gradleプラグインは非推奨になりました。
代わりに`js()`ターゲットを持つ`kotlin-multiplatform` Gradleプラグインを使用することを推奨します。

Kotlin/JS Gradleプラグインの機能は、実質的に`kotlin-multiplatform`プラグインと重複しており、内部で同じ実装を共有していました。この重複は混乱を生み出し、Kotlinチームのメンテナンス負荷を増加させていました。

マイグレーション手順については、[Kotlin Multiplatformの互換性ガイド](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html#migration-from-kotlin-js-gradle-plugin-to-kotlin-multiplatform-gradle-plugin)を参照してください。ガイドに記載されていない問題が見つかった場合は、[課題トラッカー](http://kotl.in/issue)に報告してください。

### 外部enumの非推奨化

Kotlin 1.9.0では、`entries`のような静的なenumメンバーがKotlinの外部に存在できないという問題のため、外部enumの使用は非推奨になります。代わりに、オブジェクトサブクラスを持つ外部シールドクラスの使用を推奨します。

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

外部enumからオブジェクトサブクラスを持つ外部シールドクラスに切り替えることで、外部enumと同様の機能を実現しつつ、デフォルトのメソッドに関連する問題を回避できます。

Kotlin 1.9.0以降、外部enumの使用は非推奨としてマークされます。互換性と将来のメンテナンスのために、提案された外部シールドクラスの実装を利用するようにコードを更新することを推奨します。

### ES2015クラスとモジュールの実験的サポート

このリリースでは、ES2015モジュールとES2015クラスの生成に対する[実験的](components-stability.md#stability-levels-explained)サポートが導入されました。
*   モジュールは、コードベースを簡素化し、保守性を向上させる方法を提供します。
*   クラスを使用すると、オブジェクト指向プログラミング (OOP) の原則を取り入れることができ、よりクリーンで直感的なコードになります。

これらの機能を有効にするには、`build.gradle.kts`ファイルを次のように更新します。

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

[ES2015 (ECMAScript 2015, ES6) の詳細については、公式ドキュメントを参照してください](https://262.ecma-international.org/6.0/)。

### JSプロダクション配布のデフォルトの保存先変更

Kotlin 1.9.0以前は、配布ターゲットディレクトリは`build/distributions`でした。しかし、これはGradleアーカイブの一般的なディレクトリでした。この問題を解決するため、Kotlin 1.9.0ではデフォルトの配布ターゲットディレクトリを`build/dist/<targetName>/<binaryName>`に変更しました。

例えば、`productionExecutable`は`build/distributions`にありました。Kotlin 1.9.0では、`build/dist/js/productionExecutable`にあります。

> これらのビルド結果を使用するパイプラインがある場合は、ディレクトリを更新するようにしてください。
>
{style="warning"}

### `org.w3c`宣言の`stdlib-js`からの抽出

Kotlin 1.9.0以降、`stdlib-js`には`org.w3c`宣言が含まれなくなりました。代わりに、これらの宣言は別のGradle依存関係に移動されました。Kotlin Multiplatform Gradleプラグインを`build.gradle.kts`ファイルに追加すると、これらの宣言は標準ライブラリと同様にプロジェクトに自動的に含まれます。

手動での操作やマイグレーションは必要ありません。必要な調整は自動的に処理されます。

## Gradle

Kotlin 1.9.0には、新しいGradleコンパイラオプションなど、多くの機能が追加されています。

*   [`classpath`プロパティの削除](#removed-classpath-property)
*   [新しいGradleコンパイラオプション](#new-compiler-options)
*   [Kotlin/JVM向けのプロジェクトレベルコンパイラオプション](#project-level-compiler-options-for-kotlin-jvm)
*   [Kotlin/Nativeモジュール名のコンパイラオプション](#compiler-option-for-kotlin-native-module-name)
*   [公式Kotlinライブラリのコンパイラプラグインの分離](#separate-compiler-plugins-for-official-kotlin-libraries)
*   [サポートされる最低バージョンの引き上げ](#incremented-minimum-supported-version)
*   [kaptがGradleでの先行タスク作成を引き起こさないように](#kapt-doesn-t-cause-eager-task-creation-in-gradle)
*   [JVMターゲット検証モードのプログラムによる設定](#programmatic-configuration-of-the-jvm-target-validation-mode)

### `classpath`プロパティの削除

Kotlin 1.7.0で、`KotlinCompile`タスクのプロパティである`classpath`の非推奨化サイクルを開始することを発表しました。Kotlin 1.8.0では非推奨レベルが`ERROR`に引き上げられました。このリリースでは、ついに`classpath`プロパティを削除しました。すべてのコンパイルタスクは、コンパイルに必要なライブラリのリストに対して`libraries`入力を使用するべきです。

### 新しいコンパイラオプション

Kotlin Gradleプラグインは、オプトインとコンパイラのプログレッシブモードのための新しいプロパティを提供します。

*   新しいAPIにオプトインするには、`optIn`プロパティを使用し、`optIn.set(listOf(a, b, c))`のように文字列のリストを渡すことができます。
*   プログレッシブモードを有効にするには、`progressiveMode.set(true)`を使用します。

### Kotlin/JVM向けのプロジェクトレベルコンパイラオプション

Kotlin 1.9.0以降、新しい`compilerOptions`ブロックが`kotlin`構成ブロック内で利用可能になりました。

```kotlin
kotlin {
    compilerOptions {
        jvmTarget.set(JVM.Target_11)
    }
}
```
{validate="false"}

これにより、コンパイラオプションの設定がはるかに簡単になります。ただし、いくつかの重要な詳細に注意することが重要です。

*   この構成はプロジェクトレベルでのみ機能します。
*   Androidプラグインの場合、このブロックは以下と同じオブジェクトを構成します。

```kotlin
android {
    kotlinOptions {}
}
```
{validate="false"}

*   `android.kotlinOptions`と`kotlin.compilerOptions`構成ブロックは互いに上書きし合います。ビルドファイル内で最後（最も低い）のブロックが常に有効になります。
*   `moduleName`がプロジェクトレベルで構成されている場合、その値はコンパイラに渡される際に変更される可能性があります。これは`main`コンパイルには当てはまりませんが、他のタイプ、例えばテストソースの場合、Kotlin Gradleプラグインは`_test`サフィックスを追加します。
*   `tasks.withType<KotlinJvmCompile>().configureEach {}`（または`tasks.named<KotlinJvmCompile>("compileKotlin") { }`）内の構成は、`kotlin.compilerOptions`と`android.kotlinOptions`の両方を上書きします。

### Kotlin/Nativeモジュール名のコンパイラオプション

Kotlin/Nativeの[`module-name`](compiler-reference.md#module-name-name-native)コンパイラオプションが、Kotlin Gradleプラグインで簡単に利用できるようになりました。

このオプションは、コンパイルモジュールの名前を指定し、Objective-Cにエクスポートされる宣言の名前プレフィックスを追加するためにも使用できます。

Gradleビルドファイルの`compilerOptions`ブロックで直接モジュール名を設定できるようになりました。

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

### 公式Kotlinライブラリのコンパイラプラグインの分離

Kotlin 1.9.0では、公式ライブラリ用に個別のコンパイラプラグインが導入されました。以前は、コンパイラプラグインは対応するGradleプラグインに組み込まれていました。これにより、コンパイラプラグインがGradleビルドのKotlinランタイムバージョンよりも高いKotlinバージョンに対してコンパイルされた場合、互換性の問題が発生する可能性がありました。

現在、コンパイラプラグインは個別の依存関係として追加されるため、古いGradleバージョンとの互換性の問題に直面することはなくなりました。新しいアプローチのもう一つの大きな利点は、新しいコンパイラプラグインを[Bazel](https://bazel.build/)などの他のビルドシステムでも使用できることです。

以下は、Maven Centralに公開されている新しいコンパイラプラグインのリストです。

*   kotlin-atomicfu-compiler-plugin
*   kotlin-allopen-compiler-plugin
*   kotlin-lombok-compiler-plugin
*   kotlin-noarg-compiler-plugin
*   kotlin-sam-with-receiver-compiler-plugin
*   kotlinx-serialization-compiler-plugin

すべてのプラグインには`-embeddable`版があります。例えば、`kotlin-allopen-compiler-plugin-embeddable`はスクリプトアーティファクトのデフォルトオプションである`kotlin-compiler-embeddable`アーティファクトで動作するように設計されています。

Gradleはこれらのプラグインをコンパイラ引数として追加します。既存のプロジェクトに変更を加える必要はありません。

### サポートされる最低バージョンの引き上げ

Kotlin 1.9.0以降、サポートされるAndroid Gradleプラグインの最低バージョンは4.2.2です。

[Kotlin Gradleプラグインと利用可能なGradleバージョンの互換性については、ドキュメントを参照してください](gradle-configure-project.md#apply-the-plugin)。

### kaptがGradleでの先行タスク作成を引き起こさないように

1.9.0以前は、[kaptコンパイラプラグイン](kapt.md)が、構成されたKotlinコンパイルタスクのインスタンスを要求することで、タスクの先行作成を引き起こしていました。この動作はKotlin 1.9.0で修正されました。`build.gradle.kts`ファイルのデフォルト設定を使用している場合、この変更による影響はありません。

> カスタム構成を使用している場合、セットアップが悪影響を受ける可能性があります。
> 例えば、GradleのタスクAPIを使用して`KotlinJvmCompile`タスクを変更している場合、ビルドスクリプトで同様に`KaptGenerateStubs`タスクも変更する必要があります。
>
> 例えば、スクリプトに`KotlinJvmCompile`タスクの以下の構成がある場合：
> ```kotlin
> tasks.named<KotlinJvmCompile>("compileKotlin") { // Your custom configuration }
> ```
> {validate="false"}
>
> この場合、同じ変更が`KaptGenerateStubs`タスクの一部として含まれていることを確認する必要があります：
> ```kotlin
> tasks.named<KaptGenerateStubs>("kaptGenerateStubs") { // Your custom configuration }
> ```
> {validate="false"}
>
{style="warning"}

詳細については、[YouTrackチケット](https://youtrack.jetbrains.com/issue/KT-54468/KAPT-Gradle-plugin-causes-eager-task-creation)を参照してください。

### JVMターゲット検証モードのプログラムによる設定

Kotlin 1.9.0以前は、KotlinとJava間のJVMターゲットの非互換性の検出を調整する方法は1つしかありませんでした。プロジェクト全体に対して`gradle.properties`ファイルで`kotlin.jvm.target.validation.mode=ERROR`を設定する必要がありました。

`build.gradle.kts`ファイルでタスクレベルで設定することもできるようになりました。

```kotlin
tasks.named<org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile>("compileKotlin") {
    jvmTargetValidationMode.set(org.jetbrains.kotlin.gradle.dsl.jvm.JvmTargetValidationMode.WARNING)
}
```
{validate="false"}

## 標準ライブラリ

Kotlin 1.9.0では、標準ライブラリにいくつかの大きな改善があります。
*   [`..<`演算子](#stable-operator-for-open-ended-ranges)と[Time API](#stable-time-api)が安定版になりました。
*   [Kotlin/Native標準ライブラリが徹底的に見直され、更新されました](#the-kotlin-native-standard-library-s-journey-towards-stabilization)。
*   [`@Volatile`アノテーションがより多くのプラットフォームで使用できるようになりました](#stable-volatile-annotation)。
*   [正規表現キャプチャグループを名前で取得する**共通**関数があります](#new-common-function-to-get-regex-capture-group-by-name)。
*   [16進数をフォーマットおよびパースするための新しい`HexFormat`クラスが導入されました](#new-hexformat-class-to-format-and-parse-hexadecimals)。

### オープンエンドレンジの安定版`..<`演算子

[Kotlin 1.7.20](whatsnew1720.md#preview-of-the-operator-for-creating-open-ended-ranges)で導入され、1.8.0で安定版になったオープンエンドレンジの新しい`..<`演算子が、1.9.0ではオープンエンドレンジを扱う標準ライブラリAPIも安定版になりました。

私たちの調査によると、新しい`..<`演算子は、オープンエンドレンジが宣言されたときに理解しやすくします。`until`infix関数を使用すると、上限が含まれると誤解しやすいです。

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

そして、新しい`..<`演算子を使用した例を以下に示します。

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

> IntelliJ IDEA 2023.1.1以降のバージョンでは、`..<`演算子を使用できる箇所を強調表示する新しいコードインスペクションが利用できます。
>
{style="note"}

この演算子で何ができるかの詳細については、「[Kotlin 1.7.20の新機能](whatsnew1720.md#preview-of-the-operator-for-creating-open-ended-ranges)」を参照してください。

### 安定版Time API

1.3.50以降、新しい時間計測APIをプレビューしてきました。APIの期間部分は1.6.0で安定版になりました。1.9.0では、残りの時間計測APIが安定版になりました。

古い時間APIは、`measureTimeMillis`と`measureNanoTime`関数を提供していましたが、これらは直感的ではありませんでした。これら2つの関数が異なる単位で時間を計測することは明らかですが、`measureTimeMillis`が時間を計測するために[ウォールクロック](https://ja.wikipedia.org/wiki/%E5%AE%9F%E6%99%82%E9%96%93_(%E3%82%B3%E3%83%B3%E3%83%94%E3%83%A5%E3%83%BC%E3%82%BF))を使用し、`measureNanoTime`がモノトニックな時間ソースを使用することは明らかではありませんでした。新しい時間APIはこれを解決し、APIをよりユーザーフレンドリーにするための他の問題も解決します。

新しい時間APIを使用すると、簡単に以下のことができます。
*   モノトニックな時間ソースと希望の時間単位を使用して、コードの実行にかかる時間を測定します。
*   特定の時点をマークします。
*   2つの時点を比較し、その差を求めます。
*   特定の時点からどれくらいの時間が経過したかを確認します。
*   現在の時間が特定の時点を過ぎたかどうかを確認します。

#### コード実行時間の計測

コードブロックの実行にかかる時間を計測するには、[`measureTime`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html)インライン関数を使用します。

コードブロックの実行にかかる時間を計測し、**かつ**そのコードブロックの結果を返すには、[`measureTimedValue`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-timed-value.html)インライン関数を使用します。

デフォルトでは、両方の関数はモノトニックな時間ソースを使用します。ただし、経過実時間ソースを使用したい場合は可能です。例えば、Androidではデフォルトの時間ソース`System.nanoTime()`はデバイスがアクティブなときにのみ時間をカウントします。デバイスがディープスリープ状態に入ると、時間の追跡が失われます。デバイスがディープスリープ状態のときにも時間を追跡し続けるには、代わりに[`SystemClock.elapsedRealtimeNanos()`](https://developer.android.com/reference/android/os/SystemClock#elapsedRealtimeNanos())を使用する時間ソースを作成できます。

```kotlin
object RealtimeMonotonicTimeSource : AbstractLongTimeSource(DurationUnit.NANOSECONDS) {
    override fun read(): Long = SystemClock.elapsedRealtimeNanos()
}
```
{validate="false"}

#### 時点のマークと時間の差の計測

特定の時点をマークするには、[`TimeSource`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/)インターフェースと[`markNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/mark-now.html)関数を使用して[`TimeMark`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/)を作成します。同じ時間ソースからの`TimeMark`間の差を測定するには、減算演算子 (`-`) を使用します。

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

Kotlin/Nativeの標準ライブラリが成長を続ける中、私たちは高い基準を満たしていることを確認するために完全なレビューを行う時期が来たと判断しました。この一環として、既存の**すべての**パブリックシグネチャを慎重にレビューしました。各シグネチャについて、以下の点を検討しました。

*   独自の使用目的があるか。
*   他のKotlin APIと一貫しているか。
*   JVMの対応する機能と似た動作をするか。
*   将来性があるか。

これらの考慮事項に基づき、以下のいずれかの決定を下しました。
*   安定版とする。
*   実験的機能とする。
*   `private`とマークする。
*   動作を変更する。
*   別の場所に移動する。
*   非推奨とする。
*   廃止とマークする。

> 既存のシグネチャが以下の場合：
> *   別のパッケージに移動された場合、元のパッケージには引き続き存在しますが、非推奨レベル`WARNING`で非推奨となりました。IntelliJ IDEAはコードインスペクション時に自動的に代替を提案します。
> *   非推奨とされた場合、非推奨レベル`WARNING`で非推奨とされました。
> *   廃止とマークされた場合、引き続き使用できますが、将来的には置き換えられます。
>
{style="note"}

ここではレビューのすべての結果をリストアップしませんが、主なハイライトは以下のとおりです。
*   Atomics APIを安定版としました。
*   [`kotlinx.cinterop`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/)を実験的とし、使用するには異なるオプトインが必要になりました。詳細については、[C-interoperabilityの明示的な安定性保証](#explicit-c-interoperability-stability-guarantees)を参照してください。
*   [`Worker`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker/)クラスとその関連APIを廃止とマークしました。
*   [`BitSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-bit-set/)クラスを廃止とマークしました。
*   `kotlin.native.internal`パッケージのすべての`public` APIを`private`とマークするか、他のパッケージに移動しました。

#### C-interoperabilityの明示的な安定性保証

APIの高品質を維持するため、[`kotlinx.cinterop`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/)を実験的とすることにしました。`kotlinx.cinterop`は徹底的に試されテストされていますが、安定版とするにはまだ改善の余地があります。このAPIを相互運用性のために使用することをお勧めしますが、プロジェクト内の特定の領域にその使用を限定するようにしてください。これにより、このAPIを安定版にするために進化させ始めたときに、移行が容易になります。

ポインタなどのC風の外部APIを使用したい場合は、`@OptIn(ExperimentalForeignApi)`でオプトインする必要があります。そうしないと、コードはコンパイルされません。

Objective-C/Swift相互運用性をカバーする残りの`kotlinx.cinterop`を使用するには、`@OptIn(BetaInteropApi)`でオプトインする必要があります。このAPIをオプトインなしで使用しようとすると、コードはコンパイルされますが、コンパイラは期待できる動作を明確に説明する警告を発します。

これらのアノテーションの詳細については、[`Annotations.kt`](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/Interop/Runtime/src/main/kotlin/kotlinx/cinterop/Annotations.kt)のソースコードを参照してください。

このレビューの一環としての**すべて**の変更の詳細については、[YouTrackチケット](https://youtrack.jetbrains.com/issue/KT-55765)を参照してください。

皆様からのフィードバックをお待ちしております！[チケット](https://youtrack.jetbrains.com/issue/KT-57728)に直接コメントすることでフィードバックを提供できます。

### 安定版`@Volatile`アノテーション

`var`プロパティに`@Volatile`アノテーションを付けると、バッキングフィールドがマークされ、そのフィールドへの読み書きがアトミックになり、書き込みが常に他のスレッドに可視になります。

1.8.20以前は、[`kotlin.jvm.Volatile`アノテーション](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-volatile/)が共通標準ライブラリで利用可能でした。しかし、このアノテーションはJVMでのみ有効でした。他のプラットフォームで使用すると無視され、エラーにつながっていました。

1.8.20では、実験的な共通アノテーション`kotlin.concurrent.Volatile`を導入し、JVMとKotlin/Nativeの両方でプレビューできるようになりました。

1.9.0では、`kotlin.concurrent.Volatile`が安定版になりました。マルチプラットフォームプロジェクトで`kotlin.jvm.Volatile`を使用している場合は、`kotlin.concurrent.Volatile`への移行を推奨します。

### 正規表現キャプチャグループを名前で取得する新しい共通関数

1.9.0以前は、正規表現マッチから名前で正規表現キャプチャグループを取得するための拡張機能が各プラットフォームに独自に存在していましたが、共通関数はありませんでした。Kotlin 1.8.0以前は、標準ライブラリがJVMターゲット1.6および1.7をまだサポートしていたため、共通関数を持つことはできませんでした。

Kotlin 1.8.0以降、標準ライブラリはJVMターゲット1.8でコンパイルされます。そのため1.9.0では、正規表現マッチングにおけるグループの内容を名前で取得できる**共通**の[`groups`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-match-result/groups.html)関数が利用可能になりました。これは、特定のキャプチャグループに属する正規表現マッチの結果にアクセスしたい場合に便利です。

以下に、`city`、`state`、`areaCode`の3つのキャプチャグループを含む正規表現の例を示します。これらのグループ名を使用して、マッチした値にアクセスできます。

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

1.9.0には、必要なすべての親ディレクトリを持つ新しいファイルを作成するために使用できる新しい`createParentDirectories()`拡張関数があります。ファイルパスを`createParentDirectories()`に提供すると、親ディレクトリが既に存在するかどうかがチェックされます。存在する場合は何もせず、存在しない場合は作成します。

`createParentDirectories()`は、ファイルをコピーする際に特に便利です。例えば、`copyToRecursively()`関数と組み合わせて使用できます。

 ```kotlin
sourcePath.copyToRecursively(
    destinationPath.createParentDirectories(), 
    followLinks = false
 )
 ```
{validate="false"}

### 16進数をフォーマットおよびパースするための新しい`HexFormat`クラス

> 新しい`HexFormat`クラスとその関連する拡張関数は[実験的](components-stability.md#stability-levels-explained)であり、使用するには`@OptIn(ExperimentalStdlibApi::class)`またはコンパイラ引数`-opt-in=kotlin.ExperimentalStdlibApi`でオプトインする必要があります。
>
{style="warning"}

1.9.0では、[`HexFormat`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/)クラスとその関連する拡張関数が実験的機能として提供され、数値と16進数文字列間の変換を可能にします。具体的には、拡張関数を使用して16進数文字列と`ByteArray`または他の数値型（`Int`、`Short`、`Long`）の間で変換できます。

例：

```kotlin
println(93.toHexString()) // "0000005d"
```
{validate="false"}

`HexFormat`クラスには、`HexFormat{}`ビルダーで構成できる書式設定オプションが含まれています。

`ByteArray`を扱う場合、プロパティで設定可能な以下のオプションがあります。

| オプション | 説明 |
|---|---|
| `upperCase` | 16進数の桁が大文字か小文字か。デフォルトでは小文字と仮定されます。`upperCase = false`。 |
| `bytes.bytesPerLine` | 1行あたりの最大バイト数。 |
| `bytes.bytesPerGroup` | 1グループあたりの最大バイト数。 |
| `bytes.bytesSeparator` | バイト間の区切り文字。デフォルトではなし。 |
| `bytes.bytesPrefix` | 各バイトの2桁の16進数表現の直前に置かれる文字列。デフォルトではなし。 |
| `bytes.bytesSuffix` | 各バイトの2桁の16進数表現の直後に置かれる文字列。デフォルトではなし。 |

例：

```kotlin
val macAddress = "001b638445e6".hexToByteArray()

// Use HexFormat{} builder to separate the hexadecimal string by colons
println(macAddress.toHexString(HexFormat { bytes.byteSeparator = ":" }))
// "00:1b:63:84:45:e6"

// Use HexFormat{} builder to:
// * Make the hexadecimal string uppercase
// * Group the bytes in pairs
// * Separate by periods
val threeGroupFormat = HexFormat { upperCase = true; bytes.bytesPerGroup = 2; bytes.groupSeparator = "." }

println(macAddress.toHexString(threeGroupFormat))
// "001B.6384.45E6"
```
{validate="false"}

数値型を扱う場合、プロパティで設定可能な以下のオプションがあります。

| オプション | 説明 |
|---|---|
| `number.prefix` | 16進数文字列のプレフィックス。デフォルトではなし。 |
| `number.suffix` | 16進数文字列のサフィックス。デフォルトではなし。 |
| `number.removeLeadingZeros` | 16進数文字列の先行ゼロを削除するかどうか。デフォルトでは先行ゼロは削除されません。`number.removeLeadingZeros = false` |

例：

```kotlin
// Use HexFormat{} builder to parse a hexadecimal that has prefix: "0x".
println("0x3a".hexToInt(HexFormat { number.prefix = "0x" })) // "58"
```
{validate="false"}

## ドキュメントの更新

Kotlinのドキュメントにはいくつかの注目すべき変更が加えられました。
*   [Kotlinのツアー](kotlin-tour-welcome.md) – Kotlinプログラミング言語の基礎を、理論と実践の両方を含む章で学びます。
*   [Androidソースセットレイアウト](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-android-layout.html) – 新しいAndroidソースセットレイアウトについて学びます。
*   [Kotlin Multiplatformの互換性ガイド](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html) – Kotlin Multiplatformでプロジェクトを開発する際に遭遇する可能性のある互換性のない変更について学びます。
*   [Kotlin Wasm](wasm-overview.md) – Kotlin/Wasmと、Kotlin Multiplatformプロジェクトでの使用方法について学びます。

## Kotlin 1.9.0のインストール

### IDEバージョンの確認

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2022.3.3および2023.1.1は、Kotlinプラグインをバージョン1.9.0に更新することを自動的に提案します。IntelliJ IDEA 2023.2にはKotlin 1.9.0プラグインが含まれる予定です。

Android Studio Giraffe (223) および Hedgehog (231) は、今後のリリースでKotlin 1.9.0をサポートする予定です。

新しいコマンドラインコンパイラは、[GitHubリリースページ](https://github.com/JetBrains/kotlin/releases/tag/v1.9.0)からダウンロードできます。

### Gradle設定の構成

Kotlinのアーティファクトと依存関係をダウンロードするには、`settings.gradle(.kts)`ファイルを更新してMaven Centralリポジトリを使用するようにしてください。

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```
{validate="false"}

リポジトリが指定されていない場合、Gradleは廃止されたJCenterリポジトリを使用するため、Kotlinアーティファクトで問題が発生する可能性があります。

## Kotlin 1.9.0の互換性ガイド

Kotlin 1.9.0は[フィーチャーリリース](kotlin-evolution-principles.md#language-and-tooling-releases)であり、そのため、以前のバージョンの言語用に書かれたコードと互換性のない変更をもたらす可能性があります。これらの変更の詳細なリストは、[Kotlin 1.9.0の互換性ガイド](compatibility-guide-19.md)にあります。