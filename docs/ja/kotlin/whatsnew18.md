[//]: # (title: Kotlin 1.8.0の新機能)

_[リリース日: 2022年12月28日](releases.md#release-details)_

Kotlin 1.8.0がリリースされました。主なハイライトは以下のとおりです。

*   [JVM向け新規実験的関数: ディレクトリ内容の再帰的コピーまたは削除](#recursive-copying-or-deletion-of-directories)
*   [kotlin-reflectのパフォーマンス向上](#improved-kotlin-reflect-performance)
*   [デバッグ体験を向上させる新しい`-Xdebug`コンパイラオプション](#a-new-compiler-option-for-disabling-optimizations)
*   [`kotlin-stdlib-jdk7`と`kotlin-stdlib-jdk8`を`kotlin-stdlib`に統合](#updated-jvm-compilation-target)
*   [Objective-C/Swift相互運用性の向上](#improved-objective-c-swift-interoperability)
*   [Gradle 7.3との互換性](#gradle)

## IDEサポート

Kotlin 1.8.0をサポートするKotlinプラグインは、以下のIDEで利用できます。

| IDE            | サポートされるバージョン     |
|----------------|--------------------------|
| IntelliJ IDEA  | 2021.3, 2022.1, 2022.2   |
| Android Studio | Electric Eel (221), Flamingo (222) |

> IntelliJ IDEA 2022.3では、IDEプラグインを更新することなく、プロジェクトをKotlin 1.8.0に更新できます。
>
> IntelliJ IDEA 2022.3で既存のプロジェクトをKotlin 1.8.0に移行するには、Kotlinのバージョンを`1.8.0`に変更し、
> GradleまたはMavenプロジェクトを再インポートします。
>
{style="note"}

## Kotlin/JVM

バージョン1.8.0から、コンパイラはJVM 19に対応するバイトコードバージョンのクラスを生成できるようになりました。
新しい言語バージョンには、以下の機能も含まれています。

*   [JVMアノテーションターゲットの生成を無効にするコンパイラオプション](#ability-to-not-generate-type-use-and-type-parameter-annotation-targets)
*   [最適化を無効にする新しい`-Xdebug`コンパイラオプション](#a-new-compiler-option-for-disabling-optimizations)
*   [旧バックエンドの削除](#removal-of-the-old-backend)
*   [Lombokの`@Builder`アノテーションのサポート](#support-for-lombok-s-builder-annotation)

### TYPE_USEおよびTYPE_PARAMETERアノテーションターゲットを生成しない機能

KotlinアノテーションがKotlinターゲットの中に`TYPE`を持つ場合、そのアノテーションはJavaアノテーションターゲットのリストで
`java.lang.annotation.ElementType.TYPE_USE`にマップされます。これは、`TYPE_PARAMETER` Kotlinターゲットが
`java.lang.annotation.ElementType.TYPE_PARAMETER` Javaターゲットにマップされるのと同じです。
これは、APIレベルが26未満のAndroidクライアントにとって問題となります。これらのターゲットはAPIに存在しないためです。

Kotlin 1.8.0から、新しいコンパイラオプション`-Xno-new-java-annotation-targets`を使用することで、
`TYPE_USE`および`TYPE_PARAMETER`アノテーションターゲットの生成を回避できます。

### 最適化を無効にする新しいコンパイラオプション

Kotlin 1.8.0では、デバッグ体験を向上させるために最適化を無効にする新しい`-Xdebug`コンパイラオプションが追加されました。
現時点では、このオプションはコルーチンの「was optimized out」機能を無効にします。
将来的には、さらなる最適化が追加された後も、このオプションはそれらを無効にします。

「was optimized out」機能は、中断関数を使用する際に変数を最適化します。しかし、最適化された変数では値が見えないため、
コードのデバッグが困難になります。

> **本番環境ではこのオプションを絶対に使用しないでください**: `-Xdebug`によるこの機能の無効化は、
> [メモリリークを引き起こす可能性があります](https://youtrack.jetbrains.com/issue/KT-48678/Coroutine-debugger-disable-was-optimised-out-compiler-feature#focus=Comments-27-6015585.0-0)。
>
{style="warning"}

### 旧バックエンドの削除

Kotlin 1.5.0で、IRベースのバックエンドが[Stable](components-stability.md)になったことを[発表しました](whatsnew15.md#stable-jvm-ir-backend)。
これは、Kotlin 1.4.*の旧バックエンドが非推奨になったことを意味しました。
Kotlin 1.8.0では、旧バックエンドを完全に削除しました。
これにより、コンパイラオプション`-Xuse-old-backend`とGradleの`useOldBackend`オプションも削除されました。

### Lombokの@Builderアノテーションのサポート

コミュニティからの[Kotlin Lombok: Support generated builders (@Builder)](https://youtrack.jetbrains.com/issue/KT-46959)
YouTrackイシューへの多くの投票により、[@Builderアノテーション](https://projectlombok.org/features/Builder)をサポートせざるを得なくなりました。

`@SuperBuilder`や`@Tolerate`アノテーションのサポートはまだ計画していませんが、
[@SuperBuilder](https://youtrack.jetbrains.com/issue/KT-53563/Kotlin-Lombok-Support-SuperBuilder)と
[@Tolerate](https://youtrack.jetbrains.com/issue/KT-53564/Kotlin-Lombok-Support-Tolerate)のイシューに十分な投票があれば再検討します。

[Lombokコンパイラプラグインの設定方法を学ぶ](lombok.md#gradle)。

## Kotlin/Native

Kotlin 1.8.0には、Objective-CとSwiftの相互運用性への変更、Xcode 14.1のサポート、
およびCocoaPods Gradleプラグインの改善が含まれています。

*   [Xcode 14.1のサポート](#support-for-xcode-14-1)
*   [Objective-C/Swift相互運用性の向上](#improved-objective-c-swift-interoperability)
*   [CocoaPods Gradleプラグインにおける動的フレームワークのデフォルト化](#dynamic-frameworks-by-default-in-the-cocoapods-gradle-plugin)

### Xcode 14.1のサポート

Kotlin/Nativeコンパイラが最新の安定版Xcodeバージョン14.1をサポートするようになりました。互換性の向上には、以下の変更が含まれます。

*   watchOSターゲット用に、Apple watchOSのARM64プラットフォームをサポートする新しい`watchosDeviceArm64`プリセットが追加されました。
*   Kotlin CocoaPods Gradleプラグインは、デフォルトでAppleフレームワークのビットコード埋め込みを行わなくなりました。
*   プラットフォームライブラリが更新され、AppleターゲットのObjective-Cフレームワークの変更が反映されました。

### Objective-C/Swift相互運用性の向上

KotlinとObjective-C/Swiftの相互運用性を高めるために、3つの新しいアノテーションが追加されました。

*   [`@ObjCName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-obj-c-name/)は、Kotlin宣言の名前を変更する代わりに、
    SwiftまたはObjective-Cでより慣用的な名前を指定できます。

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

*   [`@HiddenFromObjC`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-hidden-from-obj-c/)は、
    Kotlin宣言をObjective-Cから隠すことができます。

    このアノテーションは、Kotlinコンパイラに対し、関数またはプロパティをObjective-C、ひいてはSwiftにエクスポートしないよう指示します。
    これにより、KotlinコードをObjective-C/Swiftにより親しみやすくできます。

*   [`@ShouldRefineInSwift`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-should-refine-in-swift/)は、
    Kotlin宣言をSwiftで書かれたラッパーに置き換える場合に役立ちます。

    このアノテーションは、Kotlinコンパイラに対し、生成されたObjective-C APIで関数またはプロパティを`swift_private`としてマークするよう指示します。
    このような宣言には`__`プレフィックスが付与され、Swiftコードからは見えなくなります。

    これらの宣言は、SwiftコードでSwiftに親しみやすいAPIを作成するために引き続き使用できますが、
    例えばXcodeの自動補完では提案されません。

    SwiftでObjective-C宣言を洗練する方法の詳細については、
    [公式Appleドキュメント](https://developer.apple.com/documentation/swift/improving-objective-c-api-declarations-for-swift)を参照してください。

> 新しいアノテーションは[オプトイン](opt-in-requirements.md)が必要です。
>
{style="note"}

Kotlinチームは、これらのアノテーションを実装してくれた[Rick Clephas](https://github.com/rickclephas)に非常に感謝しています。

### CocoaPods Gradleプラグインにおける動的フレームワークのデフォルト化

Kotlin 1.8.0から、CocoaPods Gradleプラグインによって登録されるKotlinフレームワークは、デフォルトで動的にリンクされるようになりました。
以前の静的実装は、Kotlin Gradleプラグインの動作と一貫性がありませんでした。

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

静的リンクタイプの既存プロジェクトがあり、Kotlin 1.8.0にアップグレードした場合（またはリンクタイプを明示的に変更した場合）、
プロジェクトの実行でエラーが発生する可能性があります。これを解決するには、Xcodeプロジェクトを閉じ、
Podfileディレクトリで`pod install`を実行してください。

詳細については、[CocoaPods GradleプラグインDSLリファレンス](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-dsl-reference.html)を参照してください。

## Kotlin Multiplatform: 新しいAndroidソースセットレイアウト

Kotlin 1.8.0では、以前のディレクトリ命名スキームに代わる新しいAndroidソースセットレイアウトが導入されました。
以前のスキームは、複数の点で混乱を招いていました。

現在のレイアウトで作成される2つの`androidTest`ディレクトリの例を考えてみましょう。
1つは`KotlinSourceSets`用で、もう1つは`AndroidSourceSets`用です。

*   これらは異なるセマンティクスを持ちます。Kotlinの`androidTest`は`unitTest`タイプに属し、
    Androidの`androidTest`は`integrationTest`タイプに属します。
*   `src/androidTest/kotlin`が`UnitTest`を持ち、`src/androidTest/java`が`InstrumentedTest`を持つため、
    混乱を招く`SourceDirectories`レイアウトが作成されます。
*   `KotlinSourceSets`と`AndroidSourceSets`はどちらもGradle設定に類似した命名スキームを使用するため、
    両方の`androidTest`ソースセットの結果として得られる設定は、
    `androidTestImplementation`、`androidTestApi`、`androidTestRuntimeOnly`、`androidTestCompileOnly`と同じになります。

これらの既存の問題に対処するために、新しいAndroidソースセットレイアウトが導入されました。
2つのレイアウト間の主な違いをいくつか示します。

#### KotlinSourceSet命名スキーム

| 現在のソースセットレイアウト     | 新しいソースセットレイアウト      |
|------------------------------|-------------------------------|
| `targetName` + `AndroidSourceSet.name` | `targetName` + `AndroidVariantType` |

`{AndroidSourceSet.name}`は`{KotlinSourceSet.name}`に以下のようにマップされます。

|             | 現在のソースセットレイアウト | 新しいソースセットレイアウト |
|-------------|---------------------------|--------------------------|
| main        | androidMain               | androidMain              |
| test        | androidTest               | android**Unit**Test      |
| androidTest | android**Android**Test    | android**Instrumented**Test |

#### SourceDirectories

| 現在のソースセットレイアウト                               | 新しいソースセットレイアウト                                                     |
|---------------------------------------------------------|---------------------------------------------------------------------------|
| レイアウトは追加の`/kotlin` SourceDirectoriesを追加します  | `src/{AndroidSourceSet.name}/kotlin`、`src/{KotlinSourceSet.name}/kotlin` |

`{AndroidSourceSet.name}`は`{SourceDirectories included}`に以下のようにマップされます。

|             | 現在のソースセットレイアウト                                  | 新しいソースセットレイアウト                                                                          |
|-------------|------------------------------------------------------------|------------------------------------------------------------------------------------------------|
| main        | src/androidMain/kotlin, src/main/kotlin, src/main/java     | src/androidMain/kotlin, src/main/kotlin, src/main/java                                         |
| test        | src/androidTest/kotlin, src/test/kotlin, src/test/java     | src/android**Unit**Test/kotlin, src/test/kotlin, src/test/java                              |
| androidTest | src/android**Android**Test/kotlin, src/androidTest/java | src/android**Instrumented**Test/kotlin, src/androidTest/java, **src/androidTest/kotlin** |

#### `AndroidManifest.xml`ファイルの場所

| 現在のソースセットレイアウト                              | 新しいソースセットレイアウト                                 |
|--------------------------------------------------------|-------------------------------------------------------|
| src/{**Android**SourceSet.name}/AndroidManifest.xml | src/{**Kotlin**SourceSet.name}/AndroidManifest.xml |

`{AndroidSourceSet.name}`は`{AndroidManifest.xml location}`に以下のようにマップされます。

|       | 現在のソースセットレイアウト     | 新しいソースセットレイアウト                       |
|-------|-------------------------------|---------------------------------------------|
| main  | src/main/AndroidManifest.xml  | src/**android**Main/AndroidManifest.xml  |
| debug | src/debug/AndroidManifest.xml | src/**android**Debug/AndroidManifest.xml |

#### Androidと共通テストの関係

新しいAndroidソースセットレイアウトは、Android計装テスト（新しいレイアウトでは`androidInstrumentedTest`に改名）と
共通テストの関係を変更します。

以前は、`androidAndroidTest`と`commonTest`の間にデフォルトの`dependsOn`関係がありました。
実際には、これは以下のことを意味していました。

*   `commonTest`のコードは`androidAndroidTest`で利用可能でした。
*   `commonTest`の`expect`宣言には、`androidAndroidTest`に対応する`actual`実装が必要でした。
*   `commonTest`で宣言されたテストも、Android計装テストとして実行されました。

新しいAndroidソースセットレイアウトでは、`dependsOn`関係はデフォルトでは追加されません。
以前の動作を希望する場合は、`build.gradle.kts`ファイルでこの関係を手動で宣言してください。

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

以前は、Kotlin Gradleプラグインは、`debug`および`release`ビルドタイプ、または`demo`や`full`などのカスタムフレーバーに対応するAndroidソースセットを
 eagerly に作成していました。
これにより、`val androidDebug by getting { ... }`のような構成でアクセスできるようになりました。

新しいAndroidソースセットレイアウトでは、これらのソースセットは`afterEvaluate`フェーズで作成されます。
そのため、このような式は無効となり、`org.gradle.api.UnknownDomainObjectException: KotlinSourceSet with name 'androidDebug' not found`
のようなエラーが発生します。

これを回避するには、`build.gradle.kts`ファイルで新しい`invokeWhenCreated()` APIを使用します。

```kotlin
kotlin {
    // ...
    sourceSets.invokeWhenCreated("androidFreeDebug") {
        // ...
    }
}
```

### 設定とセットアップ

この新しいレイアウトは、将来のリリースでデフォルトになります。以下のGradleオプションで現在有効にできます。

```none
kotlin.mpp.androidSourceSetLayoutVersion=2
```

> この新しいレイアウトには、Android Gradleプラグイン7.0以降が必要であり、Android Studio 2022.3以降でサポートされています。
>
{style="note"}

以前のAndroidスタイルディレクトリの使用は非推奨となりました。
Kotlin 1.8.0は非推奨化サイクルの始まりを示し、現在のレイアウトに対する警告が導入されます。
以下のGradleプロパティを使用すると、この警告を抑制できます。

```none
kotlin.mpp.androidSourceSetLayoutVersion1.nowarn=true
```

## Kotlin/JS

Kotlin 1.8.0は、JS IRコンパイラバックエンドを安定化させ、JavaScript関連のGradleビルドスクリプトに新機能をもたらします。
*   [安定版JS IRコンパイラバックエンド](#stable-js-ir-compiler-backend)
*   [`yarn.lock`が更新されたことを報告する新しい設定](#new-settings-for-reporting-that-yarn-lock-has-been-updated)
*   [Gradleプロパティを介してブラウザのテストターゲットを追加する](#add-test-targets-for-browsers-via-gradle-properties)
*   [プロジェクトにCSSサポートを追加する新しいアプローチ](#new-approach-to-adding-css-support-to-your-project)

### 安定版JS IRコンパイラバックエンド

このリリースから、[Kotlin/JS中間表現（IRベース）コンパイラ](js-ir-compiler.md)バックエンドが安定版になりました。
3つのバックエンドのインフラストラクチャを統一するのに時間がかかりましたが、
現在ではすべてがKotlinコードに同じIRを使用しています。

JS IRコンパイラバックエンドが安定版になった結果、古いバックエンドは今後非推奨となります。

増分コンパイルは、安定版JS IRコンパイラとともにデフォルトで有効になっています。

古いコンパイラをまだ使用している場合は、[移行ガイド](js-ir-migration.md)を参考に、プロジェクトを新しいバックエンドに切り替えてください。

### `yarn.lock`が更新されたことを報告する新しい設定

`yarn`パッケージマネージャーを使用している場合、`yarn.lock`ファイルが更新された際に通知を受け取れる3つの新しい特別なGradle設定があります。
これらの設定は、CIビルドプロセス中に`yarn.lock`がサイレントに変更された場合に通知を受け取りたいときに使用できます。

これら3つの新しいGradleプロパティは以下のとおりです。

*   `YarnLockMismatchReport`: `yarn.lock`ファイルへの変更を報告する方法を指定します。以下のいずれかの値を使用できます。
    *   `FAIL`: 対応するGradleタスクを失敗させます。これがデフォルトです。
    *   `WARNING`: 変更に関する情報を警告ログに書き込みます。
    *   `NONE`: 報告を無効にします。
*   `reportNewYarnLock`: 最近作成された`yarn.lock`ファイルを明示的に報告します。
    デフォルトではこのオプションは無効になっています。新しい`yarn.lock`ファイルは最初の起動時に生成されるのが一般的であるためです。
    このオプションを使用して、ファイルがリポジトリにコミットされていることを確認できます。
*   `yarnLockAutoReplace`: Gradleタスクが実行されるたびに`yarn.lock`を自動的に置き換えます。

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

### Gradleプロパティを介してブラウザのテストターゲットを追加する

Kotlin 1.8.0から、Gradleプロパティファイルでさまざまなブラウザのテストターゲットを直接設定できるようになりました。
これにより、すべてのターゲットを`build.gradle.kts`に記述する必要がなくなり、ビルドスクリプトファイルのサイズが縮小されます。

このプロパティを使用して、すべてのモジュールに対してブラウザのリストを定義し、
特定のモジュールのビルドスクリプトで特定のブラウザを追加できます。

たとえば、Gradleプロパティファイルの次の行は、すべてのモジュールでFirefoxとSafariでテストを実行します。

```none
kotlin.js.browser.karma.browsers=firefox,safari
```

プロパティに[利用可能な値の完全なリストはGitHub](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/js/testing/karma/KotlinKarma.kt#L106)で参照してください。

Kotlinチームは、この機能を実装してくれた[Martynas Petuška](https://github.com/mpetuska)に深く感謝しています。

### プロジェクトにCSSサポートを追加する新しいアプローチ

このリリースでは、プロジェクトにCSSサポートを追加する新しいアプローチを提供します。
これにより多くのプロジェクトに影響が出ると予想されるため、以下に説明するようにGradleビルドスクリプトファイルを更新することを忘れないでください。

Kotlin 1.8.0より前は、`cssSupport.enabled`プロパティを使用してCSSサポートを追加していました。

```kotlin
browser {
    commonWebpackConfig {
        cssSupport.enabled = true
    }
}
```

現在では、`cssSupport {}`ブロック内の`enabled.set()`メソッドを使用する必要があります。

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

Kotlin 1.8.0は、Gradleバージョン7.2および7.3を**完全に**サポートしています。
最新のGradleリリースまでのGradleバージョンも使用できますが、その場合、非推奨の警告や一部の新しいGradle機能が動作しない可能性があることに注意してください。

このバージョンでは多くの変更が加えられています。
*   [KotlinコンパイラオプションのGradle遅延プロパティとしての公開](#exposing-kotlin-compiler-options-as-gradle-lazy-properties)
*   [サポートされる最小バージョンの引き上げ](#bumping-the-minimum-supported-versions)
*   [Kotlinデーモンフォールバック戦略の無効化機能](#ability-to-disable-the-kotlin-daemon-fallback-strategy)
*   [推移的依存関係における最新のkotlin-stdlibバージョンの使用](#usage-of-the-latest-kotlin-stdlib-version-in-transitive-dependencies)
*   [関連するKotlinとJavaコンパイルタスクのJVMターゲット互換性一致に対する強制的なチェック](#obligatory-check-for-jvm-targets-of-related-kotlin-and-java-compile-tasks)
*   [Kotlin Gradleプラグインの推移的依存関係の解決](#resolution-of-kotlin-gradle-plugins-transitive-dependencies)
*   [非推奨と削除](#deprecations-and-removals)

### KotlinコンパイラオプションのGradle遅延プロパティとしての公開

利用可能なKotlinコンパイラオプションを[Gradle遅延プロパティ](https://docs.gradle.org/current/userguide/lazy_configuration.html)
として公開し、Kotlinタスクにさらに統合するために、多くの変更が加えられました。

*   コンパイルタスクには、既存の`kotlinOptions`に似ていますが、
    戻り値の型としてGradle Properties APIの[`Property`](https://docs.gradle.org/current/javadoc/org/gradle/api/provider/Property.html)
    を使用する新しい`compilerOptions`入力があります。

    ```kotlin
    tasks.named("compileKotlin", org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile::class.java) {
        compilerOptions {
            useK2.set(true)
        }
    }
    ```

*   Kotlinツールタスク`KotlinJsDce`と`KotlinNativeLink`には、既存の`kotlinOptions`入力に似た新しい`toolOptions`入力があります。
*   新しい入力は[`@Nested` Gradleアノテーション](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/Nested.html)を持ちます。
    入力内のすべてのプロパティには、[`@Input`や`@Internal`](https://docs.gradle.org/current/userguide/more_about_tasks.html#sec:up_to_date_checks)
    などの関連するGradleアノテーションがあります。
*   Kotlin GradleプラグインAPIアーティファクトには、2つの新しいインターフェースがあります。
    *   `org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask`: `compilerOptions`入力と`compileOptions()`メソッドを持ちます。
        すべてのKotlinコンパイルタスクがこのインターフェースを実装します。
    *   `org.jetbrains.kotlin.gradle.tasks.KotlinToolTask`: `toolOptions`入力と`toolOptions()`メソッドを持ちます。
        すべてのKotlinツールタスク（`KotlinJsDce`、`KotlinNativeLink`、`KotlinNativeLinkArtifactTask`）がこのインターフェースを実装します。
*   一部の`compilerOptions`は、`String`型ではなく新しい型を使用します。
    *   [`JvmTarget`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JvmTarget.kt)
    *   [`KotlinVersion`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/KotlinVersion.kt)
        （`apiVersion`および`languageVersion`入力用）
    *   [`JsMainFunctionExecutionMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsMainFunctionExecutionMode.kt)
    *   [`JsModuleKind`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsModuleKind.kt)
    *   [`JsSourceMapEmbedMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapEmbedMode.kt)

    例：`kotlinOptions.jvmTarget = "11"`の代わりに`compilerOptions.jvmTarget.set(JvmTarget.JVM_11)`を使用できます。

    `kotlinOptions`の型は変更されておらず、内部的には`compilerOptions`の型に変換されます。
*   Kotlin GradleプラグインAPIは以前のリリースとバイナリ互換です。
    ただし、`kotlin-gradle-plugin`アーティファクトにはソースおよびABI破壊的変更がいくつかあります。
    これらの変更のほとんどは、一部の内部型への追加のジェネリックパラメータに関係します。
    重要な変更の1つは、`KotlinNativeLink`タスクが`AbstractKotlinNativeCompile`タスクを継承しなくなったことです。
*   `KotlinJsCompilerOptions.outputFile`および関連する`KotlinJsOptions.outputFile`オプションは非推奨になりました。
    代わりに`Kotlin2JsCompile.outputFileProperty`タスク入力を使用してください。

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
> これは、`compilerOptions` DSLがモジュールレベルに追加される際に、[この課題](https://youtrack.jetbrains.com/issue/KT-15370/Gradle-DSL-add-module-level-kotlin-options)の範囲で変更される予定です。
>
{style="note"}

#### 制限事項

> `kotlinOptions`タスク入力および`kotlinOptions{...}`タスクDSLはサポートモードであり、
> 将来のリリースで非推奨になる予定です。改善は`compilerOptions`および`toolOptions`のみに行われます。
>
{style="warning"}

`kotlinOptions`に対する任意のセッターまたはゲッター呼び出しは、`compilerOptions`内の関連プロパティに委譲されます。
これにより、以下の制限が生じます。
*   `compilerOptions`と`kotlinOptions`は、タスク実行フェーズで変更できません（以下の段落の例外を参照）。
*   `freeCompilerArgs`は不変の`List<String>`を返すため、例えば`kotlinOptions.freeCompilerArgs.remove("something")`は失敗します。

`kotlin-dsl`やJetpack Composeが有効なAndroid Gradleプラグイン（AGP）を含むいくつかのプラグインは、
タスク実行フェーズで`freeCompilerArgs`属性を変更しようとします。
Kotlin 1.8.0では、それらのための回避策が追加されました。
この回避策により、任意のビルドスクリプトまたはプラグインが実行フェーズで`kotlinOptions.freeCompilerArgs`を変更できますが、
ビルドログに警告が出力されます。この警告を無効にするには、新しいGradleプロパティ
`kotlin.options.suppressFreeCompilerArgsModificationWarning=true`を使用します。
Gradleは、[`kotlin-dsl`プラグイン](https://github.com/gradle/gradle/issues/22091)および
[Jetpack Composeが有効なAGP](https://issuetracker.google.com/u/1/issues/247544167)の修正を追加する予定です。

### サポートされる最小バージョンの引き上げ

Kotlin 1.8.0から、サポートされる最小Gradleバージョンは6.8.3、サポートされる最小Android Gradleプラグインバージョンは4.1.3です。

[Kotlin Gradleプラグインと利用可能なGradleバージョンの互換性については、ドキュメント](gradle-configure-project.md#apply-the-plugin)を参照してください。

### Kotlinデーモンフォールバック戦略の無効化機能

新しいGradleプロパティ`kotlin.daemon.useFallbackStrategy`が追加され、そのデフォルト値は`true`です。
値が`false`の場合、デーモンの起動または通信に問題があるとビルドが失敗します。
また、Kotlinコンパイルタスクに新しい`useDaemonFallbackStrategy`プロパティがあり、
両方を使用する場合はGradleプロパティよりも優先されます。
コンパイルを実行するためのメモリが不足している場合、その旨のメッセージがログに表示されます。

Kotlinコンパイラのフォールバック戦略は、デーモンが何らかの理由で失敗した場合に、Kotlinデーモンの外部でコンパイルを実行することです。
Gradleデーモンがオンの場合、コンパイラは「In process」戦略を使用します。
Gradleデーモンがオフの場合、コンパイラは「Out of process」戦略を使用します。
これらの[実行戦略の詳細については、ドキュメント](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)を参照してください。
別の戦略へのサイレントフォールバックは、多くのシステムリソースを消費したり、
非決定的なビルドにつながったりする可能性があることに注意してください。
詳細については、[このYouTrack課題](https://youtrack.jetbrains.com/issue/KT-48843/Add-ability-to-disable-Kotlin-daemon-fallback-strategy)を参照してください。

### 推移的依存関係における最新のkotlin-stdlibバージョンの使用

依存関係でKotlinバージョン1.8.0以降を明示的に記述した場合（例：`implementation("org.jetbrains.kotlin:kotlin-stdlib:1.8.0")`）、
Kotlin Gradleプラグインは、推移的`kotlin-stdlib-jdk7`および`kotlin-stdlib-jdk8`依存関係に対してそのKotlinバージョンを使用します。
これは、異なるstdlibバージョンからのクラスの重複を避けるためです
（[`kotlin-stdlib-jdk7`と`kotlin-stdlib-jdk8`を`kotlin-stdlib`に統合](#updated-jvm-compilation-target)の詳細を参照）。
この動作は、`kotlin.stdlib.jdk.variants.version.alignment` Gradleプロパティで無効にできます。

```none
kotlin.stdlib.jdk.variants.version.alignment=false
```

バージョンアラインメントで問題が発生した場合は、Kotlin [BOM](https://docs.gradle.org/current/userguide/platforms.html#sub:bom_import)
を介してすべてのバージョンをアラインするために、ビルドスクリプトで`kotlin-bom`へのプラットフォーム依存関係を宣言してください。

```kotlin
implementation(platform("org.jetbrains.kotlin:kotlin-bom:1.8.0"))
```

その他のケースと提案されている解決策については、[ドキュメント](gradle-configure-project.md#other-ways-to-align-versions)を参照してください。

### 関連するKotlinとJavaコンパイルタスクのJVMターゲット互換性一致に対する強制的なチェック

> このセクションは、ソースファイルがKotlinのみでJavaを使用していないJVMプロジェクトにも適用されます。
>
{style="note"}

[このリリースから](https://youtrack.jetbrains.com/issue/KT-54993/Raise-kotlin.jvm.target.validation.mode-check-default-level-to-error-when-build-is-running-on-Gradle-8)、
Gradle 8.0以降（このバージョンのGradleはまだリリースされていません）のプロジェクトでは、
[`kotlin.jvm.target.validation.mode`プロパティ](gradle-configure-project.md#check-for-jvm-target-compatibility-of-related-compile-tasks)のデフォルト値が`error`になり、
JVMターゲットに互換性がない場合にプラグインはビルドを失敗させます。

デフォルト値が`warning`から`error`に移行するのは、Gradle 8.0へのスムーズな移行のための準備ステップです。
**このプロパティを`error`に設定し**、[ツールチェーンを設定](gradle-configure-project.md#gradle-java-toolchains-support)するか、
JVMバージョンを手動でアラインすることを推奨します。

[ターゲットの互換性をチェックしない場合に何が問題になる可能性があるか](gradle-configure-project.md#what-can-go-wrong-if-targets-are-incompatible)については、
詳細を参照してください。

### Kotlin Gradleプラグインの推移的依存関係の解決

Kotlin 1.7.0では、[Gradleプラグインバリアントのサポート](whatsnew17.md#support-for-gradle-plugin-variants)を導入しました。
これらのプラグインバリアントにより、ビルドクラスパスには、一部の依存関係（通常は`kotlin-gradle-plugin-api`）の異なるバージョンに依存する
[Kotlin Gradleプラグイン](https://plugins.gradle.org/u/kotlin)の異なるバージョンが含まれる可能性があります。
これは解決の問題につながる可能性があり、`kotlin-dsl`プラグインを例として、以下の回避策を提案したいと思います。

Gradle 7.6の`kotlin-dsl`プラグインは、`org.jetbrains.kotlin.plugin.sam.with.receiver:1.7.10`プラグインに依存し、
このプラグインは`kotlin-gradle-plugin-api:1.7.10`に依存します。
`org.jetbrains.kotlin.gradle.jvm:1.8.0`プラグインを追加すると、
この`kotlin-gradle-plugin-api:1.7.10`の推移的依存関係が、
バージョン（`1.8.0`と`1.7.10`）とバリアント属性の[`org.gradle.plugin.api-version`](https://docs.gradle.org/current/javadoc/org/gradle/api/attributes/plugin/GradlePluginApiVersion.html)値との不一致により、
依存関係解決エラーを引き起こす可能性があります。
回避策として、バージョンをアラインするためにこの[制約](https://docs.gradle.org/current/userguide/dependency_constraints.html#sec:adding-constraints-transitive-deps)を追加してください。
この回避策は、[Kotlin Gradleプラグインライブラリのアラインメントプラットフォーム](https://youtrack.jetbrains.com/issue/KT-54691/Kotlin-Gradle-Plugin-libraries-alignment-platform)
（計画中）が実装されるまで必要になる場合があります。

```kotlin
dependencies {
    constraints {
        implementation("org.jetbrains.kotlin:kotlin-sam-with-receiver:1.8.0")
    }
}
```

この制約により、ビルドクラスパスの推移的依存関係で`org.jetbrains.kotlin:kotlin-sam-with-receiver:1.8.0`バージョンが強制的に使用されます。
同様の[Gradle課題トラッカーのケース](https://github.com/gradle/gradle/issues/22510#issuecomment-1292259298)については、
詳細を参照してください。

### 非推奨と削除

Kotlin 1.8.0では、以下のプロパティとメソッドの非推奨化サイクルが継続されます。

*   [Kotlin 1.7.0のノート](whatsnew17.md#changes-in-compile-tasks)で、`KotlinCompile`タスクには非推奨のKotlinプロパティ`classpath`がまだ残っており、
    将来のリリースで削除される予定であると述べました。今回、`KotlinCompile`タスクの`classpath`プロパティの非推奨レベルを`error`に変更しました。
    すべてのコンパイルタスクは、コンパイルに必要なライブラリのリストに`libraries`入力を使用します。
*   [kapt](kapt.md)をGradle Workers API経由で実行できる`kapt.use.worker.api`プロパティを削除しました。
    デフォルトでは、Kotlin 1.3.70以降、[kaptはGradleワーカーを使用しています](kapt.md#run-kapt-tasks-in-parallel)ので、
    この方法を使い続けることを推奨します。
*   Kotlin 1.7.0では、[`kotlin.compiler.execution.strategy`システムプロパティの非推奨化サイクルの開始](whatsnew17.md#deprecation-of-the-kotlin-compiler-execution-strategy-system-property)を
    発表しました。このリリースでは、このプロパティを削除しました。
    [Kotlinコンパイラの実行戦略を他の方法で定義する方法](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)については、詳細を参照してください。

## 標準ライブラリ

Kotlin 1.8.0:
*   [JVMコンパイルターゲットを更新します](#updated-jvm-compilation-target)。
*   多くの関数を安定化させます – [JavaとKotlin間のTimeUnit変換](#timeunit-conversion-between-java-and-kotlin)、
    [`cbrt()`](#cbrt)、[Java `Optional`拡張関数](#java-optionals-extension-functions)。
*   [比較可能で減算可能な`TimeMarks`のプレビュー](#comparable-and-subtractable-timemarks)を提供します。
*   [`java.nio.file.path`向けの実験的拡張関数](#recursive-copying-or-deletion-of-directories)を含みます。
*   [kotlin-reflectのパフォーマンス向上](#improved-kotlin-reflect-performance)を実現します。

### 更新されたJVMコンパイルターゲット

Kotlin 1.8.0では、標準ライブラリ（`kotlin-stdlib`、`kotlin-reflect`、`kotlin-script-*`）はJVMターゲット1.8でコンパイルされます。
以前は、標準ライブラリはJVMターゲット1.6でコンパイルされていました。

Kotlin 1.8.0は、JVMターゲット1.6および1.7をサポートしなくなりました。
結果として、これらのアーティファクトの内容が`kotlin-stdlib`に統合されたため、
ビルドスクリプトで`kotlin-stdlib-jdk7`と`kotlin-stdlib-jdk8`を個別に宣言する必要がなくなりました。

> `kotlin-stdlib-jdk7`と`kotlin-stdlib-jdk8`をビルドスクリプトで明示的に依存関係として宣言している場合は、
> それらを`kotlin-stdlib`に置き換える必要があります。
>
{style="note"}

異なるバージョンのstdlibアーティファクトを混在させると、クラスの重複やクラスの欠落につながる可能性があることに注意してください。
これを避けるために、Kotlin Gradleプラグインが[stdlibバージョンのアラインメント](#usage-of-the-latest-kotlin-stdlib-version-in-transitive-dependencies)に役立ちます。

### cbrt()

`double`または`float`の実数立方根を計算できる`cbrt()`関数がStableになりました。

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

### TimeUnitのJavaとKotlin間の変換

`kotlin.time`の`toTimeUnit()`および`toDurationUnit()`関数がStableになりました。
Kotlin 1.6.0で実験的として導入されたこれらの関数は、KotlinとJava間の相互運用性を向上させます。
これで、Javaの`java.util.concurrent.TimeUnit`とKotlinの`kotlin.time.DurationUnit`の間で簡単に変換できます。
これらの関数はJVMでのみサポートされています。

```kotlin
import kotlin.time.*

// For use from Java
fun wait(timeout: Long, unit: TimeUnit) {
    val duration: Duration = timeout.toDuration(unit.toDurationUnit())
    ...
}
```

### 比較可能で減算可能なTimeMarks

> `TimeMarks`の新しい機能は[Experimental](components-stability.md#stability-levels-explained)であり、
> 使用するには`@OptIn(ExperimentalTime::class)`または`@ExperimentalTime`でオプトインする必要があります。
>
{style="warning"}

Kotlin 1.8.0より前では、複数の`TimeMarks`と**現在**との時間差を計算したい場合、
一度に1つの`TimeMark`でしか`elapsedNow()`を呼び出すことができませんでした。
これにより、2つの`elapsedNow()`関数呼び出しが正確に同時に実行できないため、結果を比較することが困難でした。

これを解決するため、Kotlin 1.8.0では、同じ時間ソースからの`TimeMarks`を減算および比較できるようになりました。
これにより、**現在**を表す新しい`TimeMark`インスタンスを作成し、そこから他の`TimeMarks`を減算できます。
こうすることで、これらの計算から収集される結果は、互いに相対的であることが保証されます。

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

この新しい機能は、異なるフレームを表す複数の`TimeMarks`間の差を計算したり比較したりしたいアニメーション計算において特に有用です。

### ディレクトリの再帰的なコピーまたは削除

> `java.nio.file.path`のこれらの新しい関数は[Experimental](components-stability.md#stability-levels-explained)です。
> これらを使用するには、`@OptIn(kotlin.io.path.ExperimentalPathApi::class)`または`@kotlin.io.path.ExperimentalPathApi`でオプトインする必要があります。
> あるいは、コンパイラオプション`-opt-in=kotlin.io.path.ExperimentalPathApi`を使用することもできます。
>
{style="warning"}

`java.nio.file.Path`に2つの新しい拡張関数`copyToRecursively()`と`deleteRecursively()`が導入されました。
これにより、再帰的に以下の操作を行うことができます。

*   ディレクトリとその内容を別の宛先にコピーする。
*   ディレクトリとその内容を削除する。

これらの関数は、バックアッププロセスの一部として非常に役立ちます。

#### エラー処理

`copyToRecursively()`を使用すると、コピー中に例外が発生した場合の動作を、
`onError`ラムダ関数をオーバーロードすることで定義できます。

```kotlin
sourceRoot.copyToRecursively(destinationRoot, followLinks = false,
    onError = { source, target, exception ->
        logger.logError(exception, "Failed to copy $source to $target")
        OnErrorResult.TERMINATE
    })
```
{validate="false"}

`deleteRecursively()`を使用する場合、ファイルやフォルダの削除中に例外が発生すると、そのファイルやフォルダはスキップされます。
削除が完了すると、`deleteRecursively()`は発生したすべての例外を抑制された例外として含む`IOException`をスローします。

#### ファイルの上書き

`copyToRecursively()`は、宛先ディレクトリにファイルが既に存在する場合、例外を発生させます。
ファイルを上書きしたい場合は、`overwrite`を引数に持ち、それを`true`に設定するオーバーロードを使用します。

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

独自のカスタムコピーロジックを定義するには、`copyAction`を追加の引数に持つオーバーロードを使用します。
`copyAction`を使用すると、たとえば、好みの動作を持つラムダ関数を提供できます。

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

これらの拡張関数の詳細については、[APIリファレンス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.path/java.nio.file.-path/copy-to-recursively.html)を参照してください。

### Java Optional拡張関数

[Kotlin 1.7.0](whatsnew17.md#new-experimental-extension-functions-for-java-optionals)で導入された拡張関数がStableになりました。
これらの関数は、JavaのOptionalクラスを扱うのを簡素化します。
これらはJVM上で`Optional`オブジェクトをアンラップして変換するために使用でき、
Java APIをより簡潔に扱うことができます。詳細については、[Kotlin 1.7.0の新機能](whatsnew17.md#new-experimental-extension-functions-for-java-optionals)を参照してください。

### kotlin-reflectのパフォーマンス向上

`kotlin-reflect`がJVMターゲット1.8でコンパイルされるようになったことを利用し、内部キャッシュメカニズムをJavaの`ClassValue`に移行しました。
以前は`KClass`のみをキャッシュしていましたが、現在は`KType`と`KDeclarationContainer`もキャッシュしています。
これらの変更により、`typeOf()`呼び出し時のパフォーマンスが大幅に向上しました。

## ドキュメントの更新

Kotlinのドキュメントにいくつかの注目すべき変更が加えられました。

### 改訂されたページと新規ページ

*   [Gradleの概要](gradle.md) – GradleビルドシステムでKotlinプロジェクトを設定およびビルドする方法、
    利用可能なコンパイラオプション、Kotlin Gradleプラグインでのコンパイルとキャッシュについて学びます。
*   [JavaとKotlinのNull可能性](java-to-kotlin-nullability-guide.md) – JavaとKotlinの、
    nullの可能性がある変数を扱うアプローチの違いを確認します。
*   [Lincheckガイド](lincheck-guide.md) – JVM上の並行アルゴリズムをテストするためのLincheckフレームワークのセットアップと使用方法を学びます。

### 新規および更新されたチュートリアル

*   [GradleとKotlin/JVMを始める](get-started-with-jvm-gradle-project.md) – IntelliJ IDEAとGradleを使用してコンソールアプリケーションを作成します。
*   [KtorとSQLDelightを使用したマルチプラットフォームアプリの作成](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ktor-sqldelight.html) – Kotlin Multiplatform Mobileを使用してiOSとAndroid向けのモバイルアプリケーションを作成します。
*   [Kotlin Multiplatformを始める](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html) – Kotlinを使用したクロスプラットフォームモバイル開発について学び、AndroidとiOSの両方で動作するアプリを作成します。

## Kotlin 1.8.0のインストール

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2021.3、2022.1、および2022.2は、Kotlinプラグインをバージョン1.8.0に更新することを自動的に提案します。
IntelliJ IDEA 2022.3には、今後のマイナーアップデートでKotlinプラグインのバージョン1.8.0がバンドルされる予定です。

> IntelliJ IDEA 2022.3で既存のプロジェクトをKotlin 1.8.0に移行するには、Kotlinのバージョンを`1.8.0`に変更し、
> GradleまたはMavenプロジェクトを再インポートします。
>
{style="note"}

Android Studio Electric Eel (221)およびFlamingo (222)については、Kotlinプラグインのバージョン1.8.0が今後のAndroid Studioのアップデートで提供されます。
新しいコマンドラインコンパイラは、[GitHubのリリースページ](https://github.com/JetBrains/kotlin/releases/tag/v1.8.0)からダウンロードできます。

## Kotlin 1.8.0の互換性ガイド

Kotlin 1.8.0は[機能リリース](kotlin-evolution-principles.md#language-and-tooling-releases)であるため、
以前の言語バージョンで書かれたコードと互換性のない変更をもたらす可能性があります。
これらの変更の詳細なリストは、[Kotlin 1.8.0の互換性ガイド](compatibility-guide-18.md)で確認してください。