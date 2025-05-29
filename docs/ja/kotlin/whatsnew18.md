[//]: # (title: Kotlin 1.8.0の新機能)

_[リリース日: 2022年12月28日](releases.md#release-details)_

Kotlin 1.8.0がリリースされました。主なハイライトをいくつかご紹介します。

*   [JVM向けにディレクトリの内容を再帰的にコピーまたは削除する新しい実験的関数](#recursive-copying-or-deletion-of-directories)
*   [kotlin-reflectのパフォーマンス向上](#improved-kotlin-reflect-performance)
*   [デバッグ体験を向上させる新しい-Xdebugコンパイラオプション](#a-new-compiler-option-for-disabling-optimizations)
*   [`kotlin-stdlib-jdk7`と`kotlin-stdlib-jdk8`が`kotlin-stdlib`にマージ](#updated-jvm-compilation-target)
*   [Objective-C/Swift相互運用性の向上](#improved-objective-c-swift-interoperability)
*   [Gradle 7.3との互換性](#gradle)

## IDEサポート

1.8.0をサポートするKotlinプラグインは、以下のIDEで利用可能です。

| IDE            | サポートされているバージョン |
|----------------|--------------------------|
| IntelliJ IDEA  | 2021.3, 2022.1, 2022.2   |
| Android Studio | Electric Eel (221), Flamingo (222) |

> IntelliJ IDEA 2022.3では、IDEプラグインを更新することなく、プロジェクトをKotlin 1.8.0に更新できます。
>
> 既存のプロジェクトをIntelliJ IDEA 2022.3でKotlin 1.8.0に移行するには、Kotlinのバージョンを`1.8.0`に変更し、
> GradleまたはMavenプロジェクトを再インポートします。
>
{style="note"}

## Kotlin/JVM

バージョン1.8.0から、コンパイラはJVM 19に対応するバイトコードバージョンのクラスを生成できるようになりました。
新しい言語バージョンには以下も含まれます。

*   [JVMアノテーションターゲットの生成をオフにするコンパイラオプション](#ability-to-not-generate-type-use-and-type-parameter-annotation-targets)
*   [最適化を無効にする新しい`-Xdebug`コンパイラオプション](#a-new-compiler-option-for-disabling-optimizations)
*   [古いバックエンドの削除](#removal-of-the-old-backend)
*   [Lombokの@Builderアノテーションのサポート](#support-for-lombok-s-builder-annotation)

### TYPE_USEおよびTYPE_PARAMETERアノテーションターゲットを生成しない機能

KotlinアノテーションにKotlinターゲットとして`TYPE`が含まれている場合、そのアノテーションはJavaアノテーションターゲットのリストで`java.lang.annotation.ElementType.TYPE_USE`にマップされます。これは、`TYPE_PARAMETER` Kotlinターゲットが`java.lang.annotation.ElementType.TYPE_PARAMETER` Javaターゲットにマップされるのと同様です。これは、APIレベルが26未満のAndroidクライアントにとって問題となります。これらのAPIレベルにはこれらのターゲットがAPIに含まれていないためです。

Kotlin 1.8.0から、新しいコンパイラオプション`-Xno-new-java-annotation-targets`を使用して、`TYPE_USE`および`TYPE_PARAMETER`アノテーションターゲットの生成を回避できます。

### 最適化を無効にする新しいコンパイラオプション

Kotlin 1.8.0では、デバッグ体験を向上させるために最適化を無効にする新しいコンパイラオプション`-Xdebug`が追加されました。
現時点では、このオプションはコルーチンにおける「was optimized out」機能を無効にします。将来、さらに最適化が追加された際には、このオプションでそれらも無効にできるようになります。

「was optimized out」機能は、suspend関数を使用する際に変数を最適化します。しかし、最適化された変数はその値を確認できないため、コードのデバッグが困難になります。

> **本番環境でこのオプションを使用しないでください**：`-Xdebug`を介してこの機能を無効にすると、
> [メモリリークを引き起こす可能性があります](https://youtrack.jetbrains.com/issue/KT-48678/Coroutine-debugger-disable-was-optimised-out-compiler-feature#focus=Comments-27-6015585.0-0)。
>
{style="warning"}

### 古いバックエンドの削除

Kotlin 1.5.0で、IRベースのバックエンドが[安定版（Stable）](components-stability.md)になったことを[発表](whatsnew15.md#stable-jvm-ir-backend)しました。
これは、Kotlin 1.4.*からの古いバックエンドが非推奨になったことを意味します。Kotlin 1.8.0では、古いバックエンドを完全に削除しました。
これにより、コンパイラオプション`-Xuse-old-backend`およびGradleの`useOldBackend`オプションも削除されました。

### Lombokの@Builderアノテーションのサポート

コミュニティから[Kotlin Lombok: Support generated builders (@Builder)](https://youtrack.jetbrains.com/issue/KT-46959)
YouTrack課題に多くの投票があったため、[`@Builder`アノテーション](https://projectlombok.org/features/Builder)をサポートせざるを得ませんでした。

現時点では、`@SuperBuilder`または`@Tolerate`アノテーションをサポートする計画はありませんが、
[@SuperBuilder](https://youtrack.jetbrains.com/issue/KT-53563/Kotlin-Lombok-Support-SuperBuilder)と
[@Tolerate](https://youtrack.jetbrains.com/issue/KT-53564/Kotlin-Lombok-Support-Tolerate)の課題に十分な投票があれば再検討します。

[Lombokコンパイラプラグインの設定方法](lombok.md#gradle)をご覧ください。

## Kotlin/Native

Kotlin 1.8.0には、Objective-CおよびSwiftとの相互運用性の変更、Xcode 14.1のサポート、CocoaPods Gradleプラグインの改善が含まれています。

*   [Xcode 14.1のサポート](#support-for-xcode-14-1)
*   [Objective-C/Swift相互運用性の向上](#improved-objective-c-swift-interoperability)
*   [CocoaPods Gradleプラグインにおける動的フレームワークのデフォルト化](#dynamic-frameworks-by-default-in-the-cocoapods-gradle-plugin)

### Xcode 14.1のサポート

Kotlin/Nativeコンパイラは、最新の安定版Xcodeバージョン14.1をサポートするようになりました。互換性の改善には以下の変更が含まれます。

*   watchOSターゲット用に、Apple watchOSのARM64プラットフォームをサポートする新しい`watchosDeviceArm64`プリセットが追加されました。
*   Kotlin CocoaPods Gradleプラグインでは、Appleフレームワーク向けのビットコード埋め込みがデフォルトで無効になりました。
*   プラットフォームライブラリが、Appleターゲット向けのObjective-Cフレームワークの変更を反映するように更新されました。

### Objective-C/Swift相互運用性の向上

KotlinとObjective-CおよびSwiftとの相互運用性を高めるために、3つの新しいアノテーションが追加されました。

*   [`@ObjCName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-obj-c-name/)を使用すると、Kotlinの宣言をリネームする代わりに、SwiftまたはObjective-Cでより慣用的な名前を指定できます。

    このアノテーションは、Kotlinコンパイラに対し、このクラス、プロパティ、パラメータ、または関数にカスタムのObjective-CおよびSwift名を使用するよう指示します。

    ```kotlin
    @ObjCName(swiftName = "MySwiftArray")
    class MyKotlinArray {
        @ObjCName("index")
        fun indexOf(@ObjCName("of") element: String): Int = TODO()
    }

    // Usage with the ObjCName annotations
    let array = MySwiftArray()
    let index = array.index(of: "element")
    ```

*   [`@HiddenFromObjC`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-hidden-from-obj-c/)を使用すると、Kotlinの宣言をObjective-Cから隠すことができます。

    このアノテーションは、Kotlinコンパイラに対し、関数またはプロパティをObjective-C（および結果としてSwift）にエクスポートしないよう指示します。これにより、KotlinコードをよりObjective-C/Swiftフレンドリーにすることができます。

*   [`@ShouldRefineInSwift`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-should-refine-in-swift/)は、Kotlinの宣言をSwiftで書かれたラッパーに置き換える場合に便利です。

    このアノテーションは、Kotlinコンパイラに対し、生成されたObjective-C APIで関数またはプロパティを`swift_private`としてマークするよう指示します。このような宣言には`__`プレフィックスが付けられ、Swiftコードからは見えなくなります。

    これらの宣言は、SwiftフレンドリーなAPIを作成するためにSwiftコードで引き続き使用できますが、例えばXcodeのオートコンプリートでは提案されません。

    SwiftでObjective-C宣言を洗練する方法の詳細については、[Appleの公式ドキュメント](https://developer.apple.com/documentation/swift/improving-objective-c-api-declarations-for-swift)を参照してください。

> 新しいアノテーションには[オプトイン](opt-in-requirements.md)が必要です。
>
{style="note"}

Kotlinチームは、これらのアノテーションを実装してくれた[Rick Clephas](https://github.com/rickclephas)に非常に感謝しています。

### CocoaPods Gradleプラグインにおける動的フレームワークのデフォルト化

Kotlin 1.8.0から、CocoaPods Gradleプラグインによって登録されたKotlinフレームワークは、デフォルトで動的にリンクされるようになりました。
以前の静的実装は、Kotlin Gradleプラグインの動作と整合性がありませんでした。

```kotlin
kotlin {
    cocoapods {
        framework {
            baseName = "MyFramework"
            isStatic = false // Now dynamic by default
        }
    }
}
```

既存のプロジェクトで静的リンクタイプを使用しており、Kotlin 1.8.0にアップグレードした場合（またはリンクタイプを明示的に変更した場合）、プロジェクトの実行でエラーが発生する可能性があります。これを修正するには、Xcodeプロジェクトを閉じて、Podfileディレクトリで`pod install`を実行してください。

詳細については、[CocoaPods GradleプラグインDSLリファレンス](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-dsl-reference.html)を参照してください。

## Kotlin Multiplatform: 新しいAndroidソースセットレイアウト

Kotlin 1.8.0では、新しいAndroidソースセットレイアウトが導入されました。これは、これまでのディレクトリの命名規則が複数の点で混乱を招いていたため、それに代わるものです。

現在のレイアウトで作成される2つの`androidTest`ディレクトリの例を考えてみましょう。1つは`KotlinSourceSets`用で、もう1つは`AndroidSourceSets`用です。

*   意味が異なります。Kotlinの`androidTest`は`unitTest`タイプに属しますが、Androidの`androidTest`は`integrationTest`タイプに属します。
*   混乱を招く`SourceDirectories`レイアウトが作成されます。`src/androidTest/kotlin`には`UnitTest`があり、`src/androidTest/java`には`InstrumentedTest`があります。
*   `KotlinSourceSets`と`AndroidSourceSets`の両方がGradleの設定に同様の命名規則を使用するため、両方のKotlinとAndroidのソースセットの`androidTest`の最終的な設定は`androidTestImplementation`、`androidTestApi`、`androidTestRuntimeOnly`、`androidTestCompileOnly`と同じになります。

これらの既存の問題に対処するために、新しいAndroidソースセットレイアウトが導入されました。
2つのレイアウトの主な違いをいくつか示します。

#### KotlinSourceSetの命名規則

| 現在のソースセットレイアウト           | 新しいソースセットレイアウト           |
|------------------------------------|----------------------------------|
| `targetName` + `AndroidSourceSet.name` | `targetName` + `AndroidVariantType` |

`{AndroidSourceSet.name}`は、次のように`{KotlinSourceSet.name}`にマッピングされます。

|             | 現在のソースセットレイアウト | 新しいソースセットレイアウト     |
|-------------|--------------------------|--------------------------------|
| main        | androidMain              | androidMain                    |
| test        | androidTest              | android<b>Unit</b>Test         |
| androidTest | android<b>Android</b>Test | android<b>Instrumented</b>Test |

#### SourceDirectories

| 現在のソースセットレイアウト                                     | 新しいソースセットレイアウト                                                                    |
|----------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| レイアウトは追加の`/kotlin` SourceDirectoriesを追加します        | `src/{AndroidSourceSet.name}/kotlin`、`src/{KotlinSourceSet.name}/kotlin`                   |

`{AndroidSourceSet.name}`は、次のように`{SourceDirectories included}`にマッピングされます。

|             | 現在のソースセットレイアウト                           | 新しいソースセットレイアウト                                                                   |
|-------------|--------------------------------------------------|--------------------------------------------------------------------------------------------|
| main        | src/androidMain/kotlin, src/main/kotlin, src/main/java | src/androidMain/kotlin, src/main/kotlin, src/main/java                                         |
| test        | src/androidTest/kotlin, src/test/kotlin, src/test/java | src/android<b>Unit</b>Test/kotlin, src/test/kotlin, src/test/java                              |
| androidTest | src/android<b>Android</b>Test/kotlin, src/androidTest/java | src/android<b>Instrumented</b>Test/kotlin, src/androidTest/java, <b>src/androidTest/kotlin</b> |

#### AndroidManifest.xmlファイルの場所

| 現在のソースセットレイアウト                                 | 新しいソースセットレイアウト                                   |
|----------------------------------------------------------|--------------------------------------------------------|
| src/{<b>Android</b>SourceSet.name}/AndroidManifest.xml | src/{<b>Kotlin</b>SourceSet.name}/AndroidManifest.xml |

`{AndroidSourceSet.name}`は、次のように`{AndroidManifest.xml location}`にマッピングされます。

|       | 現在のソースセットレイアウト     | 新しいソースセットレイアウト                |
|-------|------------------------------|-------------------------------------|
| main  | src/main/AndroidManifest.xml | src/<b>android</b>Main/AndroidManifest.xml |
| debug | src/debug/AndroidManifest.xml | src/<b>android</b>Debug/AndroidManifest.xml |

#### Androidテストと共通テストの関係

新しいAndroidソースセットレイアウトは、Androidインストルメンテッドテスト（新しいレイアウトでは`androidInstrumentedTest`に改名）と共通テストの関係を変更します。

以前は、`androidAndroidTest`と`commonTest`の間にデフォルトの`dependsOn`関係がありました。実際には、これは以下のことを意味していました。

*   `commonTest`のコードが`androidAndroidTest`で利用可能でした。
*   `commonTest`の`expect`宣言は、`androidAndroidTest`に対応する`actual`実装を持つ必要がありました。
*   `commonTest`で宣言されたテストもAndroidインストルメンテッドテストとして実行されていました。

新しいAndroidソースセットレイアウトでは、`dependsOn`関係はデフォルトでは追加されません。以前の動作を希望する場合は、`build.gradle.kts`ファイルでこの関係を手動で宣言してください。

```kotlin
kotlin {
    // ...
    sourceSets {
        val commonTest by getting
        val androidInstrumentedTest by getting {
            dependsOn(commonTest)
        }
    }
}
```

#### Androidフレーバーのサポート

以前は、Kotlin Gradleプラグインは、`debug`および`release`ビルドタイプまたは`demo`や`full`などのカスタムフレーバーを持つAndroidソースセットに対応するソースセットを積極的に作成していました。
これにより、`val androidDebug by getting { ... }`のような構造でアクセスできるようになっていました。

新しいAndroidソースセットレイアウトでは、これらのソースセットは`afterEvaluate`フェーズで作成されます。これにより、そのような式は無効になり、`org.gradle.api.UnknownDomainObjectException: KotlinSourceSet with name 'androidDebug' not found`のようなエラーが発生します。

これを回避するには、`build.gradle.kts`ファイルで新しい`invokeWhenCreated()` APIを使用してください。

```kotlin
kotlin {
    // ...
    sourceSets.invokeWhenCreated("androidFreeDebug") {
        // ...
    }
}
```

### 設定とセットアップ

新しいレイアウトは今後のリリースでデフォルトになります。現在は以下のGradleオプションで有効にできます。

```none
kotlin.mpp.androidSourceSetLayoutVersion=2
```

> 新しいレイアウトにはAndroid Gradleプラグイン7.0以降が必要であり、Android Studio 2022.3以降でサポートされています。
>
{style="note"}

以前のAndroidスタイルのディレクトリの使用は現在推奨されていません。Kotlin 1.8.0は非推奨サイクルの開始を告げ、現在のレイアウトに対する警告を導入しています。以下のGradleプロパティを使用すると、警告を抑制できます。

```none
kotlin.mpp.androidSourceSetLayoutVersion1.nowarn=true
```

## Kotlin/JS

Kotlin 1.8.0では、JS IRコンパイラバックエンドが安定化され、JavaScript関連のGradleビルドスクリプトに新機能が追加されました。
*   [安定版JS IRコンパイラバックエンド](#stable-js-ir-compiler-backend)
*   [yarn.lockが更新されたことを報告する新しい設定](#new-settings-for-reporting-that-yarn-lock-has-been-updated)
*   [Gradleプロパティを介したブラウザのテストターゲットの追加](#add-test-targets-for-browsers-via-gradle-properties)
*   [プロジェクトにCSSサポートを追加する新しいアプローチ](#new-approach-to-adding-css-support-to-your-project)

### 安定版JS IRコンパイラバックエンド

このリリースから、[Kotlin/JS中間表現（IRベース）コンパイラ](js-ir-compiler.md)バックエンドが安定版（Stable）になりました。3つのバックエンドのインフラストラクチャを統一するのに時間がかかりましたが、現在ではKotlinコードに対して同じIRで動作します。

安定版JS IRコンパイラバックエンドの結果として、古いバックエンドは今後は非推奨となります。

安定版JS IRコンパイラとともに、インクリメンタルコンパイルがデフォルトで有効になりました。

まだ古いコンパイラを使用している場合は、[移行ガイド](js-ir-migration.md)を参考に新しいバックエンドにプロジェクトを切り替えてください。

### yarn.lockが更新されたことを報告する新しい設定

`yarn`パッケージマネージャーを使用している場合、`yarn.lock`ファイルが更新された際に通知を受け取ることができる3つの新しい特別なGradle設定があります。これらの設定は、CIビルドプロセス中に`yarn.lock`がサイレントに変更された場合に通知を受け取りたいときに使用できます。

これら3つの新しいGradleプロパティは次のとおりです。

*   `YarnLockMismatchReport`：`yarn.lock`ファイルの変更がどのように報告されるかを指定します。以下の値のいずれかを使用できます。
    *   `FAIL`：対応するGradleタスクを失敗させます。これがデフォルトです。
    *   `WARNING`：変更に関する情報を警告ログに書き込みます。
    *   `NONE`：レポートを無効にします。
*   `reportNewYarnLock`：新しく作成された`yarn.lock`ファイルを明示的に報告します。デフォルトでは、このオプションは無効になっています。これは、最初の起動時に新しい`yarn.lock`ファイルを生成するのが一般的であるためです。このオプションを使用すると、ファイルがリポジトリにコミットされていることを確認できます。
*   `yarnLockAutoReplace`：Gradleタスクが実行されるたびに`yarn.lock`を自動的に置き換えます。

これらのオプションを使用するには、`build.gradle.kts`ファイルを次のように更新します。

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnLockMismatchReport
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension

rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin::class.java) {
    rootProject.the<YarnRootExtension>().yarnLockMismatchReport =
        YarnLockMismatchReport.WARNING // NONE | FAIL
    rootProject.the<YarnRootExtension>().reportNewYarnLock = false // true
    rootProject.the<YarnRootExtension>().yarnLockAutoReplace = false // true
}
```

### Gradleプロパティを介したブラウザのテストターゲットの追加

Kotlin 1.8.0から、異なるブラウザのテストターゲットをGradleプロパティファイル内で直接設定できるようになりました。これにより、`build.gradle.kts`にすべてのターゲットを記述する必要がなくなるため、ビルドスクリプトファイルのサイズを縮小できます。

このプロパティを使用して、すべてのモジュールに対してブラウザのリストを定義し、特定のモジュールのビルドスクリプトに特定のブラウザを追加できます。

例えば、Gradleプロパティファイルの以下の行は、すべてのモジュールでFirefoxとSafariでテストを実行します。

```none
kotlin.js.browser.karma.browsers=firefox,safari
```

プロパティに[利用可能な値の完全なリストはGitHub](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/js/testing/karma/KotlinKarma.kt#L106)で確認できます。

Kotlinチームは、この機能を実装してくれた[Martynas Petuška](https://github.com/mpetuska)に非常に感謝しています。

### プロジェクトにCSSサポートを追加する新しいアプローチ

このリリースでは、プロジェクトにCSSサポートを追加する新しいアプローチが提供されます。これにより多くのプロジェクトに影響が出ると予想されるため、以下に説明するようにGradleビルドスクリプトファイルを忘れずに更新してください。

Kotlin 1.8.0以前は、`cssSupport.enabled`プロパティを使用してCSSサポートを追加していました。

```kotlin
browser {
    commonWebpackConfig {
        cssSupport.enabled = true
    }
}
```

今後は、`cssSupport {}`ブロック内で`enabled.set()`メソッドを使用する必要があります。

```kotlin
browser {
    commonWebpackConfig {
        cssSupport {
            enabled.set(true)
        }
    }
}
```

## Gradle

Kotlin 1.8.0はGradleバージョン7.2および7.3を**完全に**サポートしています。最新のGradleリリースまで使用することもできますが、その場合は非推奨の警告に遭遇したり、一部の新しいGradle機能が動作しない可能性があることに留意してください。

このバージョンでは多くの変更が加えられています。
*   [KotlinコンパイラオプションのGradle遅延プロパティとしての公開](#exposing-kotlin-compiler-options-as-gradle-lazy-properties)
*   [最小サポートバージョンの引き上げ](#bumping-the-minimum-supported-versions)
*   [Kotlinデーモンフォールバック戦略を無効にする機能](#ability-to-disable-the-kotlin-daemon-fallback-strategy)
*   [推移的依存関係における最新のkotlin-stdlibバージョンの使用](#usage-of-the-latest-kotlin-stdlib-version-in-transitive-dependencies)
*   [関連するKotlinとJavaコンパイルタスクのJVMターゲット互換性の強制的なチェック](#obligatory-check-for-jvm-targets-of-related-kotlin-and-java-compile-tasks)
*   [Kotlin Gradleプラグインの推移的依存関係の解決](#resolution-of-kotlin-gradle-plugins-transitive-dependencies)
*   [非推奨化と削除](#deprecations-and-removals)

### KotlinコンパイラオプションのGradle遅延プロパティとしての公開

利用可能なKotlinコンパイラオプションを[Gradle遅延プロパティ](https://docs.gradle.org/current/userguide/lazy_configuration.html)として公開し、Kotlinタスクにより適切に統合するために、多くの変更を加えました。

*   コンパイルタスクには、既存の`kotlinOptions`に似ていますが、戻り値の型としてGradle Properties APIの[`Property`](https://docs.gradle.org/current/javadoc/org/gradle/api/provider/Property.html)を使用する新しい`compilerOptions`入力があります。

    ```kotlin
    tasks.named("compileKotlin", org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile::class.java) {
        compilerOptions {
            useK2.set(true)
        }
    }
    ```

*   Kotlinツールタスク`KotlinJsDce`と`KotlinNativeLink`には、既存の`kotlinOptions`入力に似た新しい`toolOptions`入力があります。
*   新しい入力には[`@Nested` Gradleアノテーション](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/Nested.html)が付きます。入力内のすべてのプロパティには、[`@Input`や`@Internal`](https://docs.gradle.org/current/userguide/more_about_tasks.html#sec:up_to_date_checks)などの関連するGradleアノテーションが付きます。
*   一部の`compilerOptions`は、`String`型ではなく新しい型を使用します。
    *   [`JvmTarget`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JvmTarget.kt)
    *   [`KotlinVersion`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/KotlinVersion.kt)
        （`apiVersion`と`languageVersion`の入力用）
    *   [`JsMainFunctionExecutionMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsMainFunctionExecutionMode.kt)
    *   [`JsModuleKind`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsModuleKind.kt)
    *   [`JsSourceMapEmbedMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapEmbedMode.kt)

    例えば、`kotlinOptions.jvmTarget = "11"`の代わりに`compilerOptions.jvmTarget.set(JvmTarget.JVM_11)`を使用できます。

    `kotlinOptions`の型は変更されておらず、内部的に`compilerOptions`型に変換されます。
*   Kotlin GradleプラグインAPIは、以前のリリースとバイナリ互換性があります。ただし、`kotlin-gradle-plugin`アーティファクトには、ソースおよびABI互換性を破壊する変更がいくつかあります。これらの変更のほとんどは、一部の内部型に対する追加のジェネリックパラメータに関係します。重要な変更の1つは、`KotlinNativeLink`タスクが`AbstractKotlinNativeCompile`タスクを継承しなくなったことです。
*   `KotlinJsCompilerOptions.outputFile`および関連する`KotlinJsOptions.outputFile`オプションは非推奨になりました。代わりに`Kotlin2JsCompile.outputFileProperty`タスク入力を使用してください。

> Kotlin Gradleプラグインは、引き続き`KotlinJvmOptions` DSLをAndroid拡張機能に追加します。
>
> ```kotlin
> android {
>     kotlinOptions {
>         jvmTarget = "11"
>     }
> }
> ```
>
> これは、`compilerOptions` DSLがモジュールレベルに追加されるときに、[この課題](https://youtrack.jetbrains.com/issue/KT-15370/Gradle-DSL-add-module-level-kotlin-options)の範囲で変更される予定です。
>
{style="note"}

#### 制限事項

> `kotlinOptions`タスク入力と`kotlinOptions{...}`タスクDSLはサポートモードであり、
> 今後のリリースで非推奨になる予定です。改善は`compilerOptions`と`toolOptions`にのみ行われます。
>
{style="warning"}

`kotlinOptions`のセッターまたはゲッターを呼び出すと、関連する`compilerOptions`のプロパティに委譲されます。
これにより、以下の制限が生じます。
*   `compilerOptions`と`kotlinOptions`は、タスク実行フェーズで変更できません（以下の段落の例外を参照）。
*   `freeCompilerArgs`は不変の`List<String>`を返すため、例えば`kotlinOptions.freeCompilerArgs.remove("something")`は失敗します。

`kotlin-dsl`や、[Jetpack Compose](https://developer.android.com/jetpack/compose)が有効になっているAndroid Gradleプラグイン（AGP）を含むいくつかのプラグインは、タスク実行フェーズで`freeCompilerArgs`属性を変更しようとします。Kotlin 1.8.0では、それらの回避策を追加しました。この回避策により、任意のビルドスクリプトまたはプラグインが実行フェーズで`kotlinOptions.freeCompilerArgs`を変更できますが、ビルドログに警告が出力されます。この警告を無効にするには、新しいGradleプロパティ`kotlin.options.suppressFreeCompilerArgsModificationWarning=true`を使用します。
Gradleは[`kotlin-dsl`プラグイン](https://github.com/gradle/gradle/issues/22091)と
[Jetpack Composeが有効になっているAGP](https://issuetracker.google.com/u/1/issues/247544167)に対する修正を追加する予定です。

### 最小サポートバージョンの引き上げ

Kotlin 1.8.0から、サポートされるGradleの最小バージョンは6.8.3、サポートされるAndroid Gradleプラグインの最小バージョンは4.1.3です。

[Kotlin Gradleプラグインと利用可能なGradleバージョンの互換性](gradle-configure-project.md#apply-the-plugin)については、ドキュメントを参照してください。

### Kotlinデーモンフォールバック戦略を無効にする機能

新しいGradleプロパティ`kotlin.daemon.useFallbackStrategy`があり、そのデフォルト値は`true`です。値が`false`の場合、デーモンの起動または通信に問題があるとビルドは失敗します。また、Kotlinコンパイルタスクには新しい`useDaemonFallbackStrategy`プロパティがあり、両方を使用している場合はGradleプロパティよりも優先されます。コンパイルを実行するためのメモリが不足している場合は、ログにその旨のメッセージが表示されます。

Kotlinコンパイラのフォールバック戦略は、デーモンが何らかの理由で失敗した場合に、Kotlinデーモンの外部でコンパイルを実行することです。Gradleデーモンがオンの場合、コンパイラは「In process」戦略を使用します。Gradleデーモンがオフの場合、コンパイラは「Out of process」戦略を使用します。これらの[実行戦略の詳細](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)については、ドキュメントを参照してください。別の戦略へのサイレントフォールバックは、多くのシステムリソースを消費したり、非決定的なビルドにつながる可能性があることに注意してください。詳細については、[このYouTrack課題](https://youtrack.jetbrains.com/issue/KT-48843/Add-ability-to-disable-Kotlin-daemon-fallback-strategy)を参照してください。

### 推移的依存関係における最新のkotlin-stdlibバージョンの使用

依存関係でKotlinバージョン1.8.0以降を明示的に記述した場合（例: `implementation("org.jetbrains.kotlin:kotlin-stdlib:1.8.0")`）、Kotlin Gradleプラグインは、推移的な`kotlin-stdlib-jdk7`および`kotlin-stdlib-jdk8`依存関係にそのKotlinバージョンを使用します。これは、異なるstdlibバージョンからのクラスの重複を避けるために行われます（[`kotlin-stdlib-jdk7`と`kotlin-stdlib-jdk8`の`kotlin-stdlib`へのマージ](#updated-jvm-compilation-target)について詳しくはこちら）。
この動作は、`kotlin.stdlib.jdk.variants.version.alignment` Gradleプロパティで無効にできます。

```none
kotlin.stdlib.jdk.variants.version.alignment=false
```

バージョンアライメントで問題が発生した場合は、ビルドスクリプトで`kotlin-bom`にプラットフォーム依存関係を宣言することで、Kotlin [BOM](https://docs.gradle.org/current/userguide/platforms.html#sub:bom_import)を介してすべてのバージョンをアライメントしてください。

```kotlin
implementation(platform("org.jetbrains.kotlin:kotlin-bom:1.8.0"))
```

その他のケースと推奨される解決策については、[ドキュメント](gradle-configure-project.md#other-ways-to-align-versions)を参照してください。

### 関連するKotlinとJavaコンパイルタスクのJVMターゲット互換性の強制的なチェック

> このセクションは、ソースファイルがKotlinのみでJavaを使用していない場合でも、JVMプロジェクトに適用されます。
>
{style="note"}

[このリリースから](https://youtrack.jetbrains.com/issue/KT-54993/Raise-kotlin.jvm.target.validation.mode-check-default-level-to-error-when-build-is-running-on-Gradle-8)、
Gradle 8.0以降のプロジェクト（このバージョンのGradleはまだリリースされていません）では、[`kotlin.jvm.target.validation.mode`プロパティ](gradle-configure-project.md#check-for-jvm-target-compatibility-of-related-compile-tasks)のデフォルト値が`error`になり、JVMターゲットの互換性がない場合にプラグインがビルドを失敗させるようになります。

デフォルト値が`warning`から`error`に移行するのは、Gradle 8.0へのスムーズな移行のための準備ステップです。
**このプロパティを`error`に設定することをお勧めします**。そして、[ツールチェーンを設定する](gradle-configure-project.md#gradle-java-toolchains-support)か、手動でJVMバージョンを調整してください。

[ターゲットの互換性をチェックしない場合に何が問題になるか](gradle-configure-project.md#what-can-go-wrong-if-targets-are-incompatible)について詳しく学びましょう。

### Kotlin Gradleプラグインの推移的依存関係の解決

Kotlin 1.7.0で、[Gradleプラグインのバリアントのサポート](whatsnew17.md#support-for-gradle-plugin-variants)を導入しました。
これらのプラグインバリアントのため、ビルドクラスパスには、通常`kotlin-gradle-plugin-api`など、異なるバージョンの依存関係に依存する異なるバージョンの[Kotlin Gradleプラグイン](https://plugins.gradle.org/u/kotlin)が含まれる可能性があります。これは解決の問題につながる可能性があり、`kotlin-dsl`プラグインを例として、以下の回避策を提案します。

Gradle 7.6の`kotlin-dsl`プラグインは`org.jetbrains.kotlin.plugin.sam.with.receiver:1.7.10`プラグインに依存し、これは`kotlin-gradle-plugin-api:1.7.10`に依存します。`org.jetbrains.kotlin.gradle.jvm:1.8.0`プラグインを追加すると、この`kotlin-gradle-plugin-api:1.7.10`の推移的依存関係は、バージョン（`1.8.0`と`1.7.10`）とバリアント属性の[`org.gradle.plugin.api-version`](https://docs.gradle.org/current/javadoc/org/gradle/api/attributes/plugin/GradlePluginApiVersion.html)値の不一致により、依存関係の解決エラーを引き起こす可能性があります。回避策として、バージョンを揃えるためにこの[制約](https://docs.gradle.org/current/userguide/dependency_constraints.html#sec:adding-constraints-transitive-deps)を追加してください。この回避策は、[Kotlin Gradleプラグインライブラリのアライメントプラットフォーム](https://youtrack.jetbrains.com/issue/KT-54691/Kotlin-Gradle-Plugin-libraries-alignment-platform)を実装するまで必要になる場合があります。これは計画中です。

```kotlin
dependencies {
    constraints {
        implementation("org.jetbrains.kotlin:kotlin-sam-with-receiver:1.8.0")
    }
}
```

この制約により、ビルドクラスパスで推移的依存関係に`org.jetbrains.kotlin:kotlin-sam-with-receiver:1.8.0`バージョンが強制的に使用されます。[Gradle issue tracker](https://github.com/gradle/gradle/issues/22510#issuecomment-1292259298)の同様のケースについて詳しく学びましょう。

### 非推奨化と削除

Kotlin 1.8.0では、以下のプロパティとメソッドの非推奨サイクルが継続されます。

*   [Kotlin 1.7.0の注記](whatsnew17.md#changes-in-compile-tasks)で、`KotlinCompile`タスクには非推奨のKotlinプロパティ`classpath`がまだ存在し、将来のリリースで削除されることが示されていました。今回、`KotlinCompile`タスクの`classpath`プロパティの非推奨レベルを`error`に変更しました。すべてのコンパイルタスクは、コンパイルに必要なライブラリのリストに`libraries`入力を使用します。
*   [kapt](kapt.md)をGradle Workers API経由で実行できるようにする`kapt.use.worker.api`プロパティを削除しました。
    デフォルトで、[kaptはKotlin 1.3.70以降Gradle workersを使用しています](kapt.md#run-kapt-tasks-in-parallel)。この方法に固執することをお勧めします。
*   Kotlin 1.7.0で、[`kotlin.compiler.execution.strategy`プロパティの非推奨サイクル開始](whatsnew17.md#deprecation-of-the-kotlin-compiler-execution-strategy-system-property)を発表しました。
    このリリースで、このプロパティを削除しました。[Kotlinコンパイラの実行戦略を定義する他の方法](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)について学びましょう。

## 標準ライブラリ

Kotlin 1.8.0:
*   [JVMコンパイルターゲットを更新](#updated-jvm-compilation-target)しました。
*   いくつかの関数を安定化しました – [JavaとKotlin間の`TimeUnit`変換](#timeunit-conversion-between-java-and-kotlin)、
    [`cbrt()`](#cbrt)、[Java `Optionals`拡張関数](#java-optionals-extension-functions)。
*   比較可能で減算可能な[`TimeMarks`のプレビュー](#comparable-and-subtractable-timemarks)を提供します。
*   `java.nio.file.path`の[実験的な拡張関数](#recursive-copying-or-deletion-of-directories)を含みます。
*   [kotlin-reflectのパフォーマンスを向上](#improved-kotlin-reflect-performance)させました。

### 更新されたJVMコンパイルターゲット

Kotlin 1.8.0では、標準ライブラリ（`kotlin-stdlib`、`kotlin-reflect`、`kotlin-script-*`）がJVMターゲット1.8でコンパイルされるようになりました。以前は、標準ライブラリはJVMターゲット1.6でコンパイルされていました。

Kotlin 1.8.0はJVMターゲット1.6および1.7をサポートしなくなりました。結果として、`kotlin-stdlib-jdk7`および`kotlin-stdlib-jdk8`の内容が`kotlin-stdlib`にマージされたため、ビルドスクリプトでこれらを個別に宣言する必要がなくなりました。

> ビルドスクリプトで`kotlin-stdlib-jdk7`および`kotlin-stdlib-jdk8`を明示的に依存関係として宣言している場合は、
> それらを`kotlin-stdlib`に置き換える必要があります。
>
{style="note"}

stdlibアーティファクトの異なるバージョンを混在させると、クラスの重複やクラスの不足につながる可能性があることに注意してください。
これを避けるために、Kotlin Gradleプラグインは[stdlibのバージョンを揃える](#usage-of-the-latest-kotlin-stdlib-version-in-transitive-dependencies)のに役立ちます。

### cbrt()

`double`または`float`の実数立方根を計算できる`cbrt()`関数が安定版（Stable）になりました。

```kotlin
import kotlin.math.*

fun main() {
    val num = 27
    val negNum = -num

    println("The cube root of ${num.toDouble()} is: " +
            cbrt(num.toDouble()))
    println("The cube root of ${negNum.toDouble()} is: " +
            cbrt(negNum.toDouble()))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.8"}

### TimeUnitのJavaとKotlin間での変換

`kotlin.time`の`toTimeUnit()`および`toDurationUnit()`関数が安定版（Stable）になりました。Kotlin 1.6.0で実験的に導入されたこれらの関数は、KotlinとJava間の相互運用性を向上させます。これにより、Javaの`java.util.concurrent.TimeUnit`とKotlinの`kotlin.time.DurationUnit`の間で簡単に変換できるようになりました。これらの関数はJVMでのみサポートされています。

```kotlin
import kotlin.time.*

// For use from Java
fun wait(timeout: Long, unit: TimeUnit) {
    val duration: Duration = timeout.toDuration(unit.toDurationUnit())
    ...
}
```

### 比較可能で減算可能なTimeMarks

> `TimeMarks`の新しい機能は[実験的](components-stability.md#stability-levels-explained)であり、
> 使用するには`@OptIn(ExperimentalTime::class)`または`@ExperimentalTime`でオプトインする必要があります。
>
{style="warning"}

Kotlin 1.8.0以前は、複数の`TimeMarks`と**現在**の時間差を計算したい場合、一度に1つの`TimeMark`でしか`elapsedNow()`を呼び出すことができませんでした。このため、2つの`elapsedNow()`関数呼び出しをまったく同時に実行することができなかったため、結果の比較が困難でした。

これを解決するために、Kotlin 1.8.0では、同じ時間ソースからの`TimeMarks`を減算および比較できるようになりました。これで、**現在**を表す新しい`TimeMark`インスタンスを作成し、そこから他の`TimeMarks`を減算できます。これにより、これらの計算から収集される結果は、互いに対して相対的であることが保証されます。

```kotlin
import kotlin.time.*
fun main() {
//sampleStart
    val timeSource = TimeSource.Monotonic
    val mark1 = timeSource.markNow()
    Thread.sleep(500) // Sleep 0.5 seconds
    val mark2 = timeSource.markNow()

    // Before 1.8.0
    repeat(4) { n ->
        val elapsed1 = mark1.elapsedNow()
        val elapsed2 = mark2.elapsedNow()

        // Difference between elapsed1 and elapsed2 can vary depending 
        // on how much time passes between the two elapsedNow() calls
        println("Measurement 1.${n + 1}: elapsed1=$elapsed1, " +
                "elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
    }
    println()

    // Since 1.8.0
    repeat(4) { n ->
        val mark3 = timeSource.markNow()
        val elapsed1 = mark3 - mark1
        val elapsed2 = mark3 - mark2

        // Now the elapsed times are calculated relative to mark3, 
        // which is a fixed value
        println("Measurement 2.${n + 1}: elapsed1=$elapsed1, " +
                "elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
    }
    // It's also possible to compare time marks with each other
    // This is true, as mark2 was captured later than mark1
    println(mark2 > mark1)
//sampleEnd
}

```
{kotlin-runnable="true" kotlin-min-compiler-version="1.8"}

この新しい機能は、異なるフレームを表す複数の`TimeMarks`間の差を計算したり比較したりしたいアニメーション計算で特に役立ちます。

### ディレクトリの再帰的なコピーまたは削除

> `java.nio.file.path`のこれらの新しい関数は[実験的](components-stability.md#stability-levels-explained)です。
> 使用するには、`@OptIn(kotlin.io.path.ExperimentalPathApi::class)`または`@kotlin.io.path.ExperimentalPathApi`でオプトインする必要があります。
> または、コンパイラオプション`-opt-in=kotlin.io.path.ExperimentalPathApi`を使用することもできます。
>
{style="warning"}

`java.nio.file.Path`の2つの新しい拡張関数、`copyToRecursively()`と`deleteRecursively()`が導入されました。これらを使用すると、再帰的に以下を実行できます。

*   ディレクトリとその内容を別の宛先にコピーします。
*   ディレクトリとその内容を削除します。

これらの関数は、バックアッププロセスの一部として非常に役立ちます。

#### エラー処理

`copyToRecursively()`を使用すると、`onError`ラムダ関数をオーバーロードすることで、コピー中に例外が発生した場合の動作を定義できます。

```kotlin
sourceRoot.copyToRecursively(destinationRoot, followLinks = false,
    onError = { source, target, exception ->
        logger.logError(exception, "Failed to copy $source to $target")
        OnErrorResult.TERMINATE
    })
```
{validate="false"}

`deleteRecursively()`を使用する場合、ファイルまたはフォルダの削除中に例外が発生すると、そのファイルまたはフォルダはスキップされます。削除が完了すると、`deleteRecursively()`は発生したすべての例外を抑制された例外として含む`IOException`をスローします。

#### ファイルの上書き

`copyToRecursively()`が宛先ディレクトリにファイルが既に存在することを発見すると、例外が発生します。
代わりにファイルを上書きしたい場合は、`overwrite`を引数として持ち、それを`true`に設定するオーバーロードを使用してください。

```kotlin
fun setUpEnvironment(projectDirectory: Path, fixtureName: String) {
    fixturesRoot.resolve(COMMON_FIXTURE_NAME)
        .copyToRecursively(projectDirectory, followLinks = false)
    fixturesRoot.resolve(fixtureName)
        .copyToRecursively(projectDirectory, followLinks = false,
            overwrite = true) // patches the common fixture
}
```
{validate="false"}

#### カスタムコピーアクション

独自のカスタムコピーロジックを定義するには、追加の引数として`copyAction`を持つオーバーロードを使用します。
`copyAction`を使用すると、好みの操作を含むラムダ関数を提供できます。

```kotlin
sourceRoot.copyToRecursively(destinationRoot, followLinks = false) { source, target ->
    if (source.name.startsWith(".")) {
        CopyActionResult.SKIP_SUBTREE
    } else {
        source.copyToIgnoringExistingDirectory(target, followLinks = false)
        CopyActionResult.CONTINUE
    }
}
```
{validate="false"}

これらの拡張関数に関する詳細については、[APIリファレンス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.path/java.nio.file.-path/copy-to-recursively.html)を参照してください。

### Java Optionals拡張関数

[Kotlin 1.7.0](whatsnew17.md#new-experimental-extension-functions-for-java-optionals)で導入された拡張関数が安定版（Stable）になりました。これらの関数は、JavaのOptionalクラスの操作を簡素化します。これらを使用すると、JVM上で`Optional`オブジェクトをアンラップして変換し、Java APIの操作をより簡潔にすることができます。詳細については、[Kotlin 1.7.0の新機能](whatsnew17.md#new-experimental-extension-functions-for-java-optionals)を参照してください。

### kotlin-reflectのパフォーマンス向上

`kotlin-reflect`がJVMターゲット1.8でコンパイルされるようになったという事実を利用し、内部キャッシュメカニズムをJavaの`ClassValue`に移行しました。以前は`KClass`のみをキャッシュしていましたが、現在は`KType`と`KDeclarationContainer`もキャッシュしています。これらの変更により、`typeOf()`の呼び出し時におけるパフォーマンスが大幅に向上しました。

## ドキュメントの更新

Kotlinのドキュメントにはいくつかの注目すべき変更が加えられました。

### 改訂および新規ページ

*   [Gradleの概要](gradle.md) – Gradleビルドシステムを使用したKotlinプロジェクトの構成とビルド方法、利用可能なコンパイラオプション、Kotlin Gradleプラグインにおけるコンパイルとキャッシュについて学びます。
*   [JavaとKotlinのNull可能性](java-to-kotlin-nullability-guide.md) – JavaとKotlinのnull許容変数（possibly nullable variables）の扱い方における違いを確認します。
*   [Lincheckガイド](lincheck-guide.md) – JVM上で並行アルゴリズムをテストするためのLincheckフレームワークのセットアップと使用方法を学びます。

### 新規および更新されたチュートリアル

*   [GradleとKotlin/JVMを始める](get-started-with-jvm-gradle-project.md) – IntelliJ IDEAとGradleを使用してコンソールアプリケーションを作成します。
*   [KtorとSQLDelightを使用したマルチプラットフォームアプリの作成](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ktor-sqldelight.html) – Kotlin Multiplatform Mobileを使用してiOSとAndroid向けのモバイルアプリケーションを作成します。
*   [Kotlin Multiplatformを始める](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html) – Kotlinを使用したクロスプラットフォームモバイル開発について学び、AndroidとiOSの両方で動作するアプリを作成します。

## Kotlin 1.8.0のインストール

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2021.3、2022.1、および2022.2は、Kotlinプラグインをバージョン1.8.0に自動的に更新することを提案します。IntelliJ IDEA 2022.3には、今後のマイナーアップデートでKotlinプラグインのバージョン1.8.0がバンドルされる予定です。

> IntelliJ IDEA 2022.3で既存のプロジェクトをKotlin 1.8.0に移行するには、Kotlinのバージョンを`1.8.0`に変更し、
> GradleまたはMavenプロジェクトを再インポートします。
>
{style="note"}

Android Studio Electric Eel (221)とFlamingo (222)については、Kotlinプラグインのバージョン1.8.0が今後のAndroid Studioのアップデートで提供される予定です。新しいコマンドラインコンパイラは、[GitHubリリースページ](https://github.com/JetBrains/kotlin/releases/tag/v1.8.0)からダウンロードできます。

## Kotlin 1.8.0の互換性ガイド

Kotlin 1.8.0は[機能リリース](kotlin-evolution-principles.md#language-and-tooling-releases)であるため、以前の言語バージョンで書かれたコードと互換性のない変更をもたらす可能性があります。これらの変更の詳細なリストは、[Kotlin 1.8.0の互換性ガイド](compatibility-guide-18.md)で確認できます。