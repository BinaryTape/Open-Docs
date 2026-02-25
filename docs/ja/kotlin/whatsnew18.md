[//]: # (title: Kotlin 1.8.0 の新機能)

<web-summary>新しい言語機能、Kotlin Multiplatform、JVM、Native、JS へのアップデート、および Gradle と Maven のビルドツールサポートを含む、Kotlin 1.8.0 のリリースノートをご覧ください。</web-summary>

_[リリース日: 2022年12月28日](releases.md#release-history)_

Kotlin 1.8.0 がリリースされました。主なハイライトは以下の通りです。

* [JVM 向けの新しい実験的な関数：ディレクトリ内容の再帰的なコピーまたは削除](#recursive-copying-or-deletion-of-directories)
* [kotlin-reflect のパフォーマンス向上](#improved-kotlin-reflect-performance)
* [デバッグ体験を向上させる新しい -Xdebug コンパイラオプション](#a-new-compiler-option-for-disabling-optimizations)
* [`kotlin-stdlib-jdk7` と `kotlin-stdlib-jdk8` が `kotlin-stdlib` に統合](#updated-jvm-compilation-target)
* [Objective-C/Swift 相互運用性の向上](#improved-objective-c-swift-interoperability)
* [Gradle 7.3 への対応](#gradle)

> Kotlin のリリースサイクルに関する情報は、[Kotlin のリリースプロセス](releases.md)を参照してください。
>
{style="tip"}

## IDE サポート

1.8.0 をサポートする Kotlin プラグインは、以下の IDE で利用可能です。

| IDE            | サポートされているバージョン                 |
|----------------|------------------------------------|
| IntelliJ IDEA  | 2021.3, 2022.1, 2022.2             |
| Android Studio | Electric Eel (221), Flamingo (222) |

> IntelliJ IDEA 2022.3 では、IDE プラグインを更新することなく、プロジェクトを Kotlin 1.8.0 に更新できます。
>
> IntelliJ IDEA 2022.3 で既存のプロジェクトを Kotlin 1.8.0 に移行するには、Kotlin のバージョンを `1.8.0` に変更し、Gradle または Maven プロジェクトを再インポートしてください。
>
{style="note"}

## Kotlin/JVM

バージョン 1.8.0 以降、コンパイラは JVM 19 に対応するバイトコードバージョンのクラスを生成できるようになりました。
新しい言語バージョンには以下も含まれています。

* [JVM アノテーションターゲットの生成をオフにするコンパイラオプション](#ability-to-not-generate-type-use-and-type-parameter-annotation-targets)
* [最適化を無効にする新しい `-Xdebug` コンパイラオプション](#a-new-compiler-option-for-disabling-optimizations)
* [古いバックエンドの削除](#removal-of-the-old-backend)
* [Lombok の @Builder アノテーションのサポート](#support-for-lombok-s-builder-annotation)

### TYPE_USE および TYPE_PARAMETER アノテーションターゲットを生成しない機能

Kotlin アノテーションのターゲットに `TYPE` が含まれている場合、そのアノテーションは Java アノテーションターゲットのリストにおいて `java.lang.annotation.ElementType.TYPE_USE` にマップされます。これは、Kotlin の `TYPE_PARAMETER` ターゲットが Java の `java.lang.annotation.ElementType.TYPE_PARAMETER` ターゲットにマップされるのと同様です。これは、これらのターゲットが API に存在しない API レベル 26 未満の Android クライアントにとって問題となります。

Kotlin 1.8.0 以降では、新しいコンパイラオプション `-Xno-new-java-annotation-targets` を使用して、`TYPE_USE` および `TYPE_PARAMETER` アノテーションターゲットの生成を回避できます。

### 最適化を無効にする新しいコンパイラオプション

Kotlin 1.8.0 では、より良いデバッグ体験のために最適化を無効にする新しい `-Xdebug` コンパイラオプションが追加されました。
現時点では、このオプションはコルーチンの「was optimized out（最適化により削除されました）」機能を無効にします。将来、さらに最適化が追加された際にも、このオプションでそれらを無効にできるようになる予定です。

「was optimized out」機能は、サスペンド関数を使用する際に変数を最適化します。しかし、最適化された変数は値が表示されないため、コードのデバッグが困難になります。

> **このオプションを製品環境（production）で使用しないでください**: `-Xdebug` を介してこの機能を無効にすると、[メモリリークを引き起こす可能性](https://youtrack.jetbrains.com/issue/KT-48678/Coroutine-debugger-disable-was-optimised-out-compiler-feature#focus=Comments-27-6015585.0-0)があります。
>
{style="warning"}

### 古いバックエンドの削除

Kotlin 1.5.0 において、IR ベースのバックエンドが [安定版（Stable）](components-stability.md) になったことを [発表](whatsnew15.md#stable-jvm-ir-backend) しました。
これは、Kotlin 1.4.* までの古いバックエンドが非推奨になったことを意味していました。Kotlin 1.8.0 では、古いバックエンドを完全に削除しました。
それに伴い、コンパイラオプション `-Xuse-old-backend` および Gradle の `useOldBackend` オプションも削除されました。

### Lombok の @Builder アノテーションのサポート

YouTrack の課題 [Kotlin Lombok: Support generated builders (@Builder)](https://youtrack.jetbrains.com/issue/KT-46959) にコミュニティから非常に多くの投票が寄せられたため、[@Builder アノテーション](https://projectlombok.org/features/Builder) をサポートすることにしました。

`@SuperBuilder` や `@Tolerate` アノテーションをサポートする計画はまだありませんが、[@SuperBuilder](https://youtrack.jetbrains.com/issue/KT-53563/Kotlin-Lombok-Support-SuperBuilder) および [@Tolerate](https://youtrack.jetbrains.com/issue/KT-53564/Kotlin-Lombok-Support-Tolerate) の課題に十分な投票があれば再検討します。

[Lombok コンパイラプラグインの設定方法を確認する](lombok.md#gradle)。

## Kotlin/Native

Kotlin 1.8.0 には、Objective-C および Swift との相互運用性の変更、Xcode 14.1 のサポート、および CocoaPods Gradle プラグインの改善が含まれています。

* [Xcode 14.1 のサポート](#support-for-xcode-14-1)
* [Improved Objective-C/Swift 相互運用性の向上](#improved-objective-c-swift-interoperability)
* [CocoaPods Gradle プラグインで動的フレームワークがデフォルトに](#dynamic-frameworks-by-default-in-the-cocoapods-gradle-plugin)

### Xcode 14.1 のサポート

Kotlin/Native コンパイラは、最新の安定版 Xcode バージョン 14.1 をサポートするようになりました。互換性の向上には以下の変更が含まれます。

* ARM64 プラットフォーム上の Apple watchOS をサポートする、watchOS ターゲット用の新しい `watchosDeviceArm64` プリセットが追加されました。
* Kotlin CocoaPods Gradle プラグインは、Apple フレームワークのビットコード埋め込みをデフォルトで行わなくなりました。
* Apple ターゲット向けの Objective-C フレームワークの変更を反映して、プラットフォームライブラリが更新されました。

### Objective-C/Swift 相互運用性の向上

Kotlin と Objective-C および Swift との相互運用性を高めるため、3 つの新しいアノテーションが追加されました。

* [`@ObjCName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-obj-c-name/) を使用すると、Kotlin の宣言名を変更する代わりに、Swift または Objective-C においてより慣用的な（idiomatic）名前を指定できます。

  このアノテーションは、このクラス、プロパティ、パラメータ、または関数に対して、カスタムの Objective-C および Swift 名を使用するよう Kotlin コンパイラに指示します。

   ```kotlin
   @ObjCName(swiftName = "MySwiftArray")
   class MyKotlinArray {
       @ObjCName("index")
       fun indexOf(@ObjCName("of") element: String): Int = TODO()
   }

   // ObjCName アノテーションを使用した使用例
   let array = MySwiftArray()
   let index = array.index(of: "element")
   ```

* [`@HiddenFromObjC`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-hidden-from-obj-c/) を使用すると、Kotlin の宣言を Objective-C から隠すことができます。

  このアノテーションは、関数またはプロパティを Objective-C、ひいては Swift にエクスポートしないよう Kotlin コンパイラに指示します。これにより、Kotlin コードをより Objective-C/Swift フレンドリーにすることができます。

* [`@ShouldRefineInSwift`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-should-refine-in-swift/) は、Kotlin の宣言を Swift で書かれたラッパーに置き換える際に便利です。

  このアノテーションは、生成された Objective-C API において、関数またはプロパティを `swift_private` としてマークするよう Kotlin コンパイラに指示します。このような宣言には `__` プレフィックスが付けられ、Swift コードからは見えなくなります。

  これらの宣言を Swift コードで使用して Swift フレンドリーな API を作成することは可能ですが、たとえば Xcode のオートコンプリートには表示されなくなります。

  Swift での Objective-C 宣言のリファイン（精緻化）に関する詳細は、[Apple の公式ドキュメント](https://developer.apple.com/documentation/swift/improving-objective-c-api-declarations-for-swift) を参照してください。

> これらの新しいアノテーションには [オプトイン](opt-in-requirements.md) が必要です。
>
{style="note"}

Kotlin チームは、これらのアノテーションを実装してくれた [Rick Clephas](https://github.com/rickclephas) 氏に深く感謝します。

### CocoaPods Gradle プラグインで動的フレームワークがデフォルトに

Kotlin 1.8.0 以降、CocoaPods Gradle プラグインによって登録される Kotlin フレームワークは、デフォルトで動的にリンクされるようになりました。以前の静的な実装は、Kotlin Gradle プラグインの動作と一貫性がありませんでした。

```kotlin
kotlin {
    cocoapods {
        framework {
            baseName = "MyFramework"
            isStatic = false // デフォルトで動的になりました
        }
    }
}
```

静的リンクを使用している既存のプロジェクトを Kotlin 1.8.0 にアップグレードする（またはリンクタイプを明示的に変更する）場合、プロジェクトの実行時にエラーが発生することがあります。これを修正するには、Xcode プロジェクトを閉じ、Podfile のあるディレクトリで `pod install` を実行してください。

詳細については、[CocoaPods Gradle プラグインの DSL リファレンス](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-dsl-reference.html) を参照してください。

## Kotlin Multiplatform: 新しい Android ソースセットレイアウト

Kotlin 1.8.0 では、ディレクトリの命名規則が紛らわしかった以前のスキーマに代わる、新しい Android ソースセットレイアウトが導入されました。

現在のレイアウトで作成された 2 つの `androidTest` ディレクトリの例を考えてみましょう。一つは `KotlinSourceSets` 用、もう一つは `AndroidSourceSets` 用です。

* これらは異なるセマンティクスを持っています。Kotlin の `androidTest` は `unitTest` タイプに属しますが、Android のものは `integrationTest` タイプに属します。
* これにより `SourceDirectories` のレイアウトが混乱し、`src/androidTest/kotlin` には `UnitTest` が、`src/androidTest/java` には `InstrumentedTest` が配置されることになります。
* `KotlinSourceSets` と `AndroidSourceSets` の両方が Gradle コンフィギュレーションに同様の命名スキーマを使用するため、Kotlin と Android 両方のソースセットに対する `androidTest` の結果のコンフィギュレーションは同じ（`androidTestImplementation`、`androidTestApi`、`androidTestRuntimeOnly`、`androidTestCompileOnly`）になります。

これらおよびその他の既存の問題に対処するため、新しい Android ソースセットレイアウトを導入しました。
主な違いは以下の通りです。

#### KotlinSourceSet 命名スキーマ

| 現在のソースセットレイアウト              | 新しいソースセットレイアウト               |
|----------------------------------------|-------------------------------------|
| `targetName` + `AndroidSourceSet.name` | `targetName` + `AndroidVariantType` |

`{AndroidSourceSet.name}` は `{KotlinSourceSet.name}` に以下のようにマップされます。

|             | 現在のソースセットレイアウト | 新しいソースセットレイアウト          |
|-------------|---------------------------|--------------------------------|
| main        | androidMain               | androidMain                    |
| test        | androidTest               | android<b>Unit</b>Test         |
| androidTest | android<b>Android</b>Test | android<b>Instrumented</b>Test |

#### SourceDirectories

| 現在のソースセットレイアウト                               | 新しいソースセットレイアウト                                                     |
|---------------------------------------------------------|---------------------------------------------------------------------------|
| レイアウトにより追加の `/kotlin` SourceDirectories が加わる | `src/{AndroidSourceSet.name}/kotlin`, `src/{KotlinSourceSet.name}/kotlin` |

`{AndroidSourceSet.name}` は `{SourceDirectories included}` に以下のようにマップされます。

|             | 現在のソースセットレイアウト                                  | 新しいソースセットレイアウト                                                                          |
|-------------|------------------------------------------------------------|------------------------------------------------------------------------------------------------|
| main        | src/androidMain/kotlin, src/main/kotlin, src/main/java     | src/androidMain/kotlin, src/main/kotlin, src/main/java                                         |
| test        | src/androidTest/kotlin, src/test/kotlin, src/test/java     | src/android<b>Unit</b>Test/kotlin, src/test/kotlin, src/test/java                              |
| androidTest | src/android<b>Android</b>Test/kotlin, src/androidTest/java | src/android<b>Instrumented</b>Test/kotlin, src/androidTest/java, <b>src/androidTest/kotlin</b> |

#### AndroidManifest.xml ファイルの場所

| 現在のソースセットレイアウト                              | 新しいソースセットレイアウト                                 |
|--------------------------------------------------------|-------------------------------------------------------|
| src/{<b>Android</b>SourceSet.name}/AndroidManifest.xml | src/{<b>Kotlin</b>SourceSet.name}/AndroidManifest.xml |

`{AndroidSourceSet.name}` は `{AndroidManifest.xml location}` に以下のようにマップされます。

|       | 現在のソースセットレイアウト     | 新しいソースセットレイアウト                       |
|-------|-------------------------------|---------------------------------------------|
| main  | src/main/AndroidManifest.xml  | src/<b>android</b>Main/AndroidManifest.xml  |
| debug | src/debug/AndroidManifest.xml | src/<b>android</b>Debug/AndroidManifest.xml |

#### Android テストと common テストの関係

新しい Android ソースセットレイアウトでは、Android インストルメンテーションテスト（新レイアウトでは `androidInstrumentedTest` に改名）と common テストの関係が変更されます。

以前は、`androidAndroidTest` と `commonTest` の間にデフォルトで `dependsOn` 関係がありました。実際には、これは以下を意味していました。

* `commonTest` 内のコードが `androidAndroidTest` で利用可能。
* `commonTest` 内の `expect` 宣言は、`androidAndroidTest` 内に対応する `actual` 実装を持つ必要がある。
* `commonTest` で宣言されたテストが Android インストルメンテーションテストとしても実行される。

新しい Android ソースセットレイアウトでは、`dependsOn` 関係はデフォルトでは追加されません。以前の動作を希望する場合は、`build.gradle.kts` ファイルでこの関係を手動で宣言してください。

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

#### Android フレーバーのサポート

以前の Kotlin Gradle プラグインは、`debug` や `release` ビルドタイプ、または `demo` や `full` といったカスタムフレーバーに対応するソースセットを先行して（eagerly）作成していました。
これにより、`val androidDebug by getting { ... }` のような構成でアクセス可能でした。

新しい Android ソースセットレイアウトでは、それらのソースセットは `afterEvaluate` フェーズで作成されます。そのため、このような式は無効になり、`org.gradle.api.UnknownDomainObjectException: KotlinSourceSet with name 'androidDebug' not found` のようなエラーが発生します。

これを回避するには、`build.gradle.kts` ファイルで新しい `invokeWhenCreated()` API を使用してください。

```kotlin
kotlin {
    // ...
    sourceSets.invokeWhenCreated("androidFreeDebug") {
        // ...
    }
}
```

### 設定とセットアップ

新しいレイアウトは、将来のリリースでデフォルトになります。今すぐ有効にするには、以下の Gradle オプションを使用します。

```none
kotlin.mpp.androidSourceSetLayoutVersion=2
```

> 新しいレイアウトには Android Gradle プラグイン 7.0 以降が必要であり、Android Studio 2022.3 以降でサポートされています。
>
{style="note"}

以前の Android 形式のディレクトリの使用は、現在は推奨されません。Kotlin 1.8.0 は非推奨サイクルの始まりであり、現在のレイアウトに対して警告が表示されます。この警告を抑制するには、以下の Gradle プロパティを使用してください。

```none
kotlin.mpp.androidSourceSetLayoutVersion1.nowarn=true
```

## Kotlin/JS

Kotlin 1.8.0 では JS IR コンパイラバックエンドが安定化し、JavaScript 関連の Gradle ビルドスクリプトに新機能が追加されました。
* [JS IR コンパイラバックエンドが安定版に](#stable-js-ir-compiler-backend)
* [yarn.lock が更新されたことを報告する新しい設定](#new-settings-for-reporting-that-yarn-lock-has-been-updated)
* [Gradle プロパティ経由でブラウザのテストターゲットを追加](#add-test-targets-for-browsers-via-gradle-properties)
* [プロジェクトに CSS サポートを追加する新しいアプローチ](#new-approach-to-adding-css-support-to-your-project)

### JS IR コンパイラバックエンドが安定版に

本リリースより、[Kotlin/JS 中間表現（IR ベース）コンパイラ](js-ir-compiler.md) バックエンドが安定版（Stable）になりました。3 つのバックエンドすべてのインフラストラクチャを統合するのに時間がかかりましたが、現在はすべて Kotlin コードに対して同じ IR を使用して動作します。

JS IR コンパイラバックエンドが安定した結果、以前のバックエンドは今後、非推奨となります。

安定版 JS IR コンパイラとともに、増分コンパイル（Incremental compilation）がデフォルトで有効になっています。

まだ古いコンパイラを使用している場合は、プロジェクトを新しいバックエンドに切り替えてください。

### yarn.lock が更新されたことを報告する新しい設定

`yarn` パッケージマネージャーを使用している場合、`yarn.lock` ファイルが更新されたときに通知する 3 つの新しい特別な Gradle 設定があります。CI ビルドプロセス中に `yarn.lock` が暗黙のうちに変更されたかどうかを確認したい場合に、これらの設定を使用できます。

これら 3 つの新しい Gradle プロパティは以下の通りです。

* `YarnLockMismatchReport`: `yarn.lock` ファイルへの変更をどのように報告するかを指定します。以下のいずれかの値を使用できます。
    * `FAIL`: 対応する Gradle タスクを失敗させます。これがデフォルトです。
    * `WARNING`: 変更に関する情報を警告ログに書き込みます。
    * `NONE`: 報告を無効にします。
* `reportNewYarnLock`: 新しく作成された `yarn.lock` ファイルについて明示的に報告します。デフォルトでは、このオプションは無効になっています。初回起動時に新しい `yarn.lock` ファイルを生成するのが一般的な慣習であるためです。このオプションを使用して、ファイルがリポジトリにコミットされていることを確認できます。
* `yarnLockAutoReplace`: Gradle タスクが実行されるたびに `yarn.lock` を自動的に置き換えます。

これらのオプションを使用するには、ビルドスクリプトファイル `build.gradle.kts` を以下のように更新します。

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

### Gradle プロパティ経由でブラウザのテストターゲットを追加

Kotlin 1.8.0 以降、Gradle プロパティファイルで直接、さまざまなブラウザのテストターゲットを設定できるようになりました。これにより、`build.gradle.kts` にすべてのターゲットを記述する必要がなくなり、ビルドスクリプトファイルのサイズを縮小できます。

このプロパティを使用して全モジュールのブラウザリストを定義し、特定のモジュールのビルドスクリプトで特定のブラウザを追加することができます。

たとえば、Gradle プロパティファイルに以下の行を記述すると、すべてのモジュールで Firefox と Safari でテストが実行されます。

```none
kotlin.js.browser.karma.browsers=firefox,safari
```

[GitHub で利用可能なプロパティ値の完全なリスト](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/js/testing/karma/KotlinKarma.kt#L106) を確認してください。

Kotlin チームは、この機能を実装してくれた [Martynas Petuška](https://github.com/mpetuska) 氏に深く感謝します。

### プロジェクトに CSS サポートを追加する新しいアプローチ

本リリースでは、プロジェクトに CSS サポートを追加する新しいアプローチが提供されます。これは多くのプロジェクトに影響を与えると予想されるため、Gradle ビルドスクリプトファイルを以下のように更新してください。

Kotlin 1.8.0 より前は、CSS サポートを追加するために `cssSupport.enabled` プロパティが使用されていました。

```kotlin
browser {
    commonWebpackConfig {
        cssSupport.enabled = true
    }
}
```

今後は、`cssSupport {}` ブロック内で `enabled.set()` メソッドを使用する必要があります。

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

Kotlin 1.8.0 は、Gradle バージョン 7.2 および 7.3 を **完全（fully）** にサポートしています。最新の Gradle リリースまでのバージョンも使用できますが、その場合は非推奨の警告が表示されたり、一部の新しい Gradle 機能が動作しなかったりする可能性があることに注意してください。

このバージョンでは、多くの変更が加えられています。
* [Kotlin コンパイラオプションを Gradle の Lazy プロパティとして公開](#exposing-kotlin-compiler-options-as-gradle-lazy-properties)
* [最小サポートバージョンの引き上げ](#bumping-the-minimum-supported-versions)
* [Kotlin デーモンのフォールバック戦略を無効にする機能](#ability-to-disable-the-kotlin-daemon-fallback-strategy)
* [推移的依存関係における最新の kotlin-stdlib バージョンの使用](#usage-of-the-latest-kotlin-stdlib-version-in-transitive-dependencies)
* [関連する Kotlin および Java コンパイルタスクの JVM ターゲット互換性の等価性チェックを義務化](#obligatory-check-for-jvm-targets-of-related-kotlin-and-java-compile-tasks)
* [Kotlin Gradle プラグインの推移的依存関係の解決](#resolution-of-kotlin-gradle-plugins-transitive-dependencies)
* [非推奨および削除](#deprecations-and-removals)

### Kotlin コンパイラオプションを Gradle の Lazy プロパティとして公開

利用可能な Kotlin コンパイラオプションを [Gradle の Lazy プロパティ](https://docs.gradle.org/current/userguide/lazy_configuration.html) として公開し、それらを Kotlin タスクにより良く統合するために、多くの変更を加えました。

* コンパイルタスクには新しい `compilerOptions` 入力が追加されました。これは既存の `kotlinOptions` と似ていますが、戻り値の型として Gradle Properties API の [`Property`](https://docs.gradle.org/current/javadoc/org/gradle/api/provider/Property.html) を使用します。

  ```kotlin
  tasks.named("compileKotlin", org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile::class.java) {
      compilerOptions {
          useK2.set(true)
      }
  }
  ```

* Kotlin ツールタスクの `KotlinJsDce` と `KotlinNativeLink` には、既存の `kotlinOptions` 入力と同様の新しい `toolOptions` 入力が追加されました。
* 新しい入力には [`@Nested` Gradle アノテーション](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/Nested.html) が付いています。入力内のすべてのプロパティには、[`@Input` や `@Internal`](https://docs.gradle.org/current/userguide/more_about_tasks.html#sec:up_to_date_checks) といった関連する Gradle アノテーションが付いています。
* Kotlin Gradle プラグイン API アーティファクトには、2 つの新しいインターフェースが追加されました。
    * `org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask`: `compilerOptions` 入力と `compileOptions()` メソッドを持ちます。すべての Kotlin コンパイルタスクがこのインターフェースを実装します。
    * `org.jetbrains.kotlin.gradle.tasks.KotlinToolTask`: `toolOptions` 入力と `toolOptions()` メソッドを持ちます。すべての Kotlin ツールタスク（`KotlinJsDce`、`KotlinNativeLink`、および `KotlinNativeLinkArtifactTask`）がこのインターフェースを実装します。
* 一部の `compilerOptions` では、`String` 型の代わりに新しい型が使用されます。
    * [`JvmTarget`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JvmTarget.kt)
    * [`KotlinVersion`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/KotlinVersion.kt) (`apiVersion` および `languageVersion` 入力用)
    * [`JsMainFunctionExecutionMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsMainFunctionExecutionMode.kt)
    * [`JsModuleKind`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsModuleKind.kt)
    * [`JsSourceMapEmbedMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapEmbedMode.kt)

  たとえば、`kotlinOptions.jvmTarget = "11"` の代わりに `compilerOptions.jvmTarget.set(JvmTarget.JVM_11)` を使用できます。

  `kotlinOptions` の型は変更されておらず、内部的に `compilerOptions` の型に変換されます。
* Kotlin Gradle プラグイン API は、以前のリリースとバイナリ互換性があります。ただし、`kotlin-gradle-plugin` アーティファクトには一部のソースおよび ABI 破壊的変更があります。これらの変更のほとんどは、一部の内部型への追加のジェネリックパラメータを含みます。重要な変更点の一つは、`KotlinNativeLink` タスクが `AbstractKotlinNativeCompile` タスクを継承しなくなったことです。
* `KotlinJsCompilerOptions.outputFile` および関連する `KotlinJsOptions.outputFile` オプションは非推奨になりました。代わりに `Kotlin2JsCompile.outputFileProperty` タスク入力を使用してください。

> Kotlin Gradle プラグインは依然として `KotlinJvmOptions` DSL を Android エクステンションに追加します。
>
> ```kotlin
> android { 
>     kotlinOptions {
>         jvmTarget = "11"
>     }
> }
> ```
>
> これは、`compilerOptions` DSL がモジュールレベルに追加される予定の [この課題](https://youtrack.jetbrains.com/issue/KT-15370/Gradle-DSL-add-module-level-kotlin-options) の範囲内で変更される予定です。
>
{style="note"}

#### 制限事項

> `kotlinOptions` タスク入力および `kotlinOptions{...}` タスク DSL はサポートモードにあり、今後のリリースで非推奨になる予定です。改善は `compilerOptions` および `toolOptions` に対してのみ行われます。
>
{style="warning"}

`kotlinOptions` のセッターまたはゲッターを呼び出すと、`compilerOptions` の関連プロパティにデリゲートされます。
これには以下の制限があります。
* `compilerOptions` および `kotlinOptions` は、タスク実行フェーズでは変更できません（以下の段落にある例外を一つ除きます）。
* `freeCompilerArgs` はイミュータブルな `List<String>` を返すため、たとえば `kotlinOptions.freeCompilerArgs.remove("something")` は失敗します。

`kotlin-dsl` プラグインや [Jetpack Compose](https://developer.android.com/jetpack/compose) が有効な Android Gradle プラグイン (AGP) を含むいくつかのプラグインは、タスク実行フェーズで `freeCompilerArgs` 属性を変更しようとします。Kotlin 1.8.0 では、これらに対する回避策を追加しました。この回避策により、任意のビルドスクリプトやプラグインが実行フェーズで `kotlinOptions.freeCompilerArgs` を変更できるようになりますが、ビルドログに警告が出力されます。この警告を無効にするには、新しい Gradle プロパティ `kotlin.options.suppressFreeCompilerArgsModificationWarning=true` を使用してください。Gradle は [`kotlin-dsl` プラグイン](https://github.com/gradle/gradle/issues/22091) および [Jetpack Compose が有効な AGP](https://issuetracker.google.com/u/1/issues/247544167) への修正を追加する予定です。

### 最小サポートバージョンの引き上げ

Kotlin 1.8.0 以降、サポートされる最小の Gradle バージョンは 6.8.3、サポートされる最小の Android Gradle プラグインバージョンは 4.1.3 となりました。

ドキュメントの [利用可能な Gradle バージョンとの Kotlin Gradle プラグインの互換性](gradle-configure-project.md#apply-the-plugin) を参照してください。

### Kotlin デーモンのフォールバック戦略を無効にする機能

新しい Gradle プロパティ `kotlin.daemon.useFallbackStrategy` が追加されました。デフォルト値は `true` です。値を `false` に設定すると、デーモンの起動や通信に問題が発生した際にビルドが失敗します。また、Kotlin コンパイルタスクには新しい `useDaemonFallbackStrategy` プロパティもあり、両方を使用する場合はこちらが Gradle プロパティよりも優先されます。コンパイルを実行するのに十分なメモリがない場合、ログにその旨のメッセージが表示されます。

Kotlin コンパイラのフォールバック戦略とは、デーモンが何らかの理由で失敗した場合に、Kotlin デーモン以外でコンパイルを実行することです。Gradle デーモンがオンの場合、コンパイラは「In process（プロセス内）」戦略を使用します。Gradle デーモンがオフの場合、コンパイラは「Out of process（プロセス外）」戦略を使用します。これらの [実行戦略についての詳細はドキュメント](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy) を参照してください。別の戦略へのサイレントなフォールバックは、多くのシステムリソースを消費したり、非決定的なビルドにつながったりする可能性があることに注意してください。詳細は [YouTrack の課題](https://youtrack.jetbrains.com/issue/KT-48843/Add-ability-to-disable-Kotlin-daemon-fallback-strategy) を参照してください。

### 推移的依存関係における最新の kotlin-stdlib バージョンの使用

依存関係に Kotlin バージョン 1.8.0 以降を明示的に記述した場合（例: `implementation("org.jetbrains.kotlin:kotlin-stdlib:1.8.0")`）、Kotlin Gradle プラグインは推移的な `kotlin-stdlib-jdk7` および `kotlin-stdlib-jdk8` 依存関係に対してその Kotlin バージョンを使用します。これは、異なる stdlib バージョンによるクラスの重複を避けるために行われます（[`kotlin-stdlib-jdk7` と `kotlin-stdlib-jdk8` の `kotlin-stdlib` へのマージ](#updated-jvm-compilation-target) についての詳細を確認してください）。この動作は、`kotlin.stdlib.jdk.variants.version.alignment` Gradle プロパティを使用して無効にできます。

```none
kotlin.stdlib.jdk.variants.version.alignment=false
```

バージョンアライメントで問題が発生した場合は、ビルドスクリプトで `kotlin-bom` へのプラットフォーム依存関係を宣言することで、Kotlin [BOM](https://docs.gradle.org/current/userguide/platforms.html#sub:bom_import) を介してすべてのバージョンを揃えてください。

```kotlin
implementation(platform("org.jetbrains.kotlin:kotlin-bom:1.8.0"))
```

その他のケースや推奨される解決策については、[ドキュメント](gradle-configure-project.md#other-ways-to-align-versions) を参照してください。

### 関連する Kotlin および Java コンパイルタスクの JVM ターゲット互換性チェックを義務化

> このセクションは、ソースファイルが Kotlin のみで Java を使用していない JVM プロジェクトにも適用されます。
>
{style="note"}

[本リリースより](https://youtrack.jetbrains.com/issue/KT-54993/Raise-kotlin.jvm.target.validation.mode-check-default-level-to-error-when-build-is-running-on-Gradle-8)、Gradle 8.0+（このバージョンの Gradle はまだリリースされていません）のプロジェクトでは、[`kotlin.jvm.target.validation.mode` プロパティ](gradle-configure-project.md#check-for-jvm-target-compatibility-of-related-compile-tasks) のデフォルト値が `error` になり、JVM ターゲットに互換性がない場合にビルドが失敗するようになります。

デフォルト値を `warning` から `error` に変更することは、Gradle 8.0 へのスムーズな移行のための準備ステップです。**このプロパティを `error` に設定**し、[ツールチェーンを構成](gradle-configure-project.md#gradle-java-toolchains-support) するか、JVM バージョンを手動で揃えることをお勧めします。

[ターゲットの互換性をチェックしない場合に何が起こり得るか](gradle-configure-project.md#what-can-go-wrong-if-targets-are-incompatible) についての詳細を確認してください。

### Kotlin Gradle プラグインの推移的依存関係の解決

Kotlin 1.7.0 では、[Gradle プラグインバリアントのサポート](whatsnew17.md#support-for-gradle-plugin-variants) を導入しました。これらのプラグインバリアントにより、ビルドクラスパスに、依存関係（通常は `kotlin-gradle-plugin-api`）の異なるバージョンに依存する異なるバージョンの [Kotlin Gradle プラグイン](https://plugins.gradle.org/u/kotlin) が存在する可能性があります。これにより解決の問題が発生する可能性があるため、`kotlin-dsl` プラグインを例として以下の回避策を提案します。

Gradle 7.6 の `kotlin-dsl` プラグインは `org.jetbrains.kotlin.plugin.sam.with.receiver:1.7.10` プラグインに依存しており、これはさらに `kotlin-gradle-plugin-api:1.7.10` に依存しています。ここに `org.jetbrains.kotlin.gradle.jvm:1.8.0` プラグインを追加すると、バージョン（`1.8.0` と `1.7.10`）およびバリアント属性の [`org.gradle.plugin.api-version`](https://docs.gradle.org/current/javadoc/org/gradle/api/attributes/plugin/GradlePluginApiVersion.html) 値の不一致により、この `kotlin-gradle-plugin-api:1.7.10` 推移的依存関係が解決エラーを引き起こす可能性があります。回避策として、バージョンを揃えるためにこの [制約（constraint）](https://docs.gradle.org/current/userguide/dependency_constraints.html#sec:adding-constraints-transitive-deps) を追加してください。この回避策は、現在計画中である [Kotlin Gradle プラグインライブラリアライメントプラットフォーム](https://youtrack.jetbrains.com/issue/KT-54691/Kotlin-Gradle-Plugin-libraries-alignment-platform) を実装するまで必要になる可能性があります。

```kotlin
dependencies {
    constraints {
        implementation("org.jetbrains.kotlin:kotlin-sam-with-receiver:1.8.0")
    }
}
```

この制約により、ビルドクラスパスの推移的依存関係に `org.jetbrains.kotlin:kotlin-sam-with-receiver:1.8.0` バージョンが強制的に使用されます。Gradle の課題トラッカーにある [同様のケース](https://github.com/gradle/gradle/issues/22510#issuecomment-1292259298) についての詳細を確認してください。

### 非推奨および削除

Kotlin 1.8.0 では、以下のプロパティおよびメソッドの非推奨サイクルが継続されます。

* [Kotlin 1.7.0 のノート](whatsnew17.md#changes-in-compile-tasks) で述べたように、`KotlinCompile` タスクにはまだ非推奨の Kotlin プロパティ `classpath` が残っており、将来のリリースで削除される予定です。現在、`KotlinCompile` タスクの `classpath` プロパティの非推奨レベルを `error` に変更しました。すべてのコンパイルタスクは、コンパイルに必要なライブラリのリストに `libraries` 入力を使用します。
* Gradle Workers API を介して [kapt](kapt.md) を実行できるようにしていた `kapt.use.worker.api` プロパティを削除しました。Kotlin 1.3.70 以降、[kapt はデフォルトで Gradle ワーカを使用](kapt.md#run-kapt-tasks-in-parallel) しており、この方法を継続することをお勧めします。
* Kotlin 1.7.0 で、[`kotlin.compiler.execution.strategy` プロパティの非推奨サイクルの開始を発表](whatsnew17.md#deprecation-of-the-kotlin-compiler-execution-strategy-system-property) しました。本リリースでは、このプロパティを削除しました。[Kotlin コンパイラの実行戦略を定義する](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy) 他の方法を確認してください。

## 標準ライブラリ

Kotlin 1.8.0:
* [JVM コンパイルターゲット](#updated-jvm-compilation-target) を更新。
* 多数の機能を安定化：[Java と Kotlin 間の TimeUnit 変換](#timeunit-conversion-between-java-and-kotlin)、[`cbrt()`](#cbrt)、[Java `Optionals` 拡張関数](#java-optionals-extension-functions)。
* [比較および減算可能な `TimeMarks`](#comparable-and-subtractable-timemarks) のプレビューを提供。
* [`java.nio.file.path` 用の実験的な拡張関数](#recursive-copying-or-deletion-of-directories) を含む。
* [kotlin-reflect のパフォーマンス向上](#improved-kotlin-reflect-performance) を提供。

### JVM コンパイルターゲットの更新

Kotlin 1.8.0 では、標準ライブラリ（`kotlin-stdlib`、`kotlin-reflect`、および `kotlin-script-*`）が JVM ターゲット 1.8 でコンパイルされるようになりました。以前は JVM ターゲット 1.6 でコンパイルされていました。

Kotlin 1.8.0 は JVM ターゲット 1.6 および 1.7 をサポートしなくなりました。その結果、`kotlin-stdlib-jdk7` と `kotlin-stdlib-jdk8` の内容は `kotlin-stdlib` に統合されたため、これらをビルドスクリプトで個別に宣言する必要はなくなりました。

> ビルドスクリプトで `kotlin-stdlib-jdk7` および `kotlin-stdlib-jdk8` を依存関係として明示的に宣言している場合は、それらを `kotlin-stdlib` に置き換える必要があります。
>
{style="note"}

異なるバージョンの stdlib アーティファクトを混在させると、クラスの重複やクラスの欠落につながる可能性があることに注意してください。これを避けるために、Kotlin Gradle プラグインが [stdlib バージョンのアライメント](#usage-of-the-latest-kotlin-stdlib-version-in-transitive-dependencies) を支援します。

### cbrt()

`double` または `float` の実数立方根を計算できる `cbrt()` 関数が安定版（Stable）になりました。

```kotlin
import kotlin.math.*

fun main() {
    val num = 27
    val negNum = -num

    println("${num.toDouble()} の立方根は: " +
            cbrt(num.toDouble()))
    println("${negNum.toDouble()} の立方根は: " +
            cbrt(negNum.toDouble()))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.8"}

### Java と Kotlin 間の TimeUnit 変換

`kotlin.time` の `toTimeUnit()` および `toDurationUnit()` 関数が安定版（Stable）になりました。Kotlin 1.6.0 で実験的機能として導入されたこれらの関数は、Kotlin と Java 間の相互運用性を向上させます。Java の `java.util.concurrent.TimeUnit` と Kotlin の `kotlin.time.DurationUnit` を簡単に変換できるようになりました。これらの関数は JVM でのみサポートされています。

```kotlin
import kotlin.time.*

// Java からの使用向け
fun wait(timeout: Long, unit: TimeUnit) {
    val duration: Duration = timeout.toDuration(unit.toDurationUnit())
    ...
}
```

### 比較および減算可能な TimeMarks

> `TimeMarks` の新しい機能は [実験的（Experimental）](components-stability.md#stability-levels-explained) であり、使用するには `@OptIn(ExperimentalTime::class)` または `@ExperimentalTime` を使用してオプトインする必要があります。
>
{style="warning"}

Kotlin 1.8.0 より前では、複数の `TimeMarks` と「**現在（now）**」との時間差を計算したい場合、各 `TimeMark` に対して個別に `elapsedNow()` を呼び出すしかありませんでした。しかし、2 つの `elapsedNow()` 関数の呼び出しをまったく同じタイミングで実行することはできないため、結果を比較するのが困難でした。

これを解決するために、Kotlin 1.8.0 では同じタイムソースからの `TimeMarks` 同士を減算および比較できるようになりました。現在、**現在**を表す新しい `TimeMark` インスタンスを作成し、そこから他の `TimeMarks` を引くことができます。これにより、これらの計算から収集した結果が、互いに相対的であることが保証されます。

```kotlin
import kotlin.time.*
fun main() {
//sampleStart
    val timeSource = TimeSource.Monotonic
    val mark1 = timeSource.markNow()
    Thread.sleep(500) // 0.5秒スリープ
    val mark2 = timeSource.markNow()

    // 1.8.0 より前
    repeat(4) { n ->
        val elapsed1 = mark1.elapsedNow()
        val elapsed2 = mark2.elapsedNow()

        // elapsed1 と elapsed2 の差は、2つの elapsedNow() 呼び出しの間に
        // 経過した時間によって変化する可能性があります
        println("測定 1.${n + 1}: elapsed1=$elapsed1, " +
                "elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
    }
    println()

    // 1.8.0 以降
    repeat(4) { n ->
        val mark3 = timeSource.markNow()
        val elapsed1 = mark3 - mark1
        val elapsed2 = mark3 - mark2

        // これで、経過時間は固定値である mark3 に対して相対的に計算されます
        println("測定 2.${n + 1}: elapsed1=$elapsed1, " +
                "elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
    }
    // タイムマーク同士を比較することも可能です
    // mark2 は mark1 より後にキャプチャされたため、これは true です
    println(mark2 > mark1)
//sampleEnd
}

```
{kotlin-runnable="true" kotlin-min-compiler-version="1.8"}

この新機能は、異なるフレームを表す複数の `TimeMarks` 間の差を計算したり比較したりするアニメーションの計算などで特に役立ちます。

### ディレクトリの再帰的なコピーまたは削除

> `java.nio.file.path` 用のこれらの新しい関数は [実験的（Experimental）](components-stability.md#stability-levels-explained) です。
> 使用するには、`@OptIn(kotlin.io.path.ExperimentalPathApi::class)` または `@kotlin.io.path.ExperimentalPathApi` でオプトインする必要があります。
> あるいは、コンパイラオプション `-opt-in=kotlin.io.path.ExperimentalPathApi` を使用することもできます。
>
{style="warning"}

`java.nio.file.Path` 用に `copyToRecursively()` と `deleteRecursively()` という 2 つの新しい拡張関数を導入しました。これらにより、以下を再帰的に実行できます。

* ディレクトリとその内容を別の宛先にコピーする。
* ディレクトリとその内容を削除する。

これらの関数は、バックアッププロセスの一部として非常に役立ちます。

#### エラー処理

`copyToRecursively()` を使用する場合、`onError` ラムダ関数をオーバーロードすることで、コピー中に例外が発生したときに何が起こるべきかを定義できます。

```kotlin
sourceRoot.copyToRecursively(destinationRoot, followLinks = false,
    onError = { source, target, exception ->
        logger.logError(exception, "$source を $target にコピーできませんでした")
        OnErrorResult.TERMINATE
    })
```
{validate="false"}

`deleteRecursively()` を使用する場合、ファイルやフォルダの削除中に例外が発生すると、そのファイルやフォルダはスキップされます。削除が完了すると、`deleteRecursively()` は発生したすべての例外を抑制された例外（suppressed exceptions）として含む `IOException` をスローします。

#### ファイルの上書き

`copyToRecursively()` が宛先ディレクトリにファイルが既に存在することを発見した場合、例外が発生します。代わりにファイルを上書きしたい場合は、`overwrite` を引数に持つオーバーロードを使用し、それを `true` に設定します。

```kotlin
fun setUpEnvironment(projectDirectory: Path, fixtureName: String) {
    fixturesRoot.resolve(COMMON_FIXTURE_NAME)
        .copyToRecursively(projectDirectory, followLinks = false)
    fixturesRoot.resolve(fixtureName)
        .copyToRecursively(projectDirectory, followLinks = false,
            overwrite = true) // common fixture をパッチします
}
```
{validate="false"}

#### カスタムコピーアクション

コピーのための独自のカスタムロジックを定義するには、追加の引数として `copyAction` を持つオーバーロードを使用します。`copyAction` を使用することで、たとえば優先するアクションを含むラムダ関数を提供できます。

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

これらの拡張関数の詳細については、[API リファレンス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.path/java.nio.file.-path/copy-to-recursively.html) を参照してください。

### Java Optionals 拡張関数

[Kotlin 1.7.0](whatsnew17.md#new-experimental-extension-functions-for-java-optionals) で導入された拡張関数が安定版（Stable）になりました。これらの関数は、Java の Optional クラスの扱いを簡素化します。これらを使用して、JVM 上で `Optional` オブジェクトをアンラップおよび変換したり、Java API の操作をより簡潔にしたりできます。詳細については、[Kotlin 1.7.0 の新機能](whatsnew17.md#new-experimental-extension-functions-for-java-optionals) を参照してください。

### kotlin-reflect のパフォーマンス向上

`kotlin-reflect` が JVM ターゲット 1.8 でコンパイルされるようになったことを活かし、内部のキャッシュメカニズムを Java の `ClassValue` に移行しました。以前は `KClass` のみをキャッシュしていましたが、現在は `KType` と `KDeclarationContainer` もキャッシュするようになりました。これらの変更により、`typeOf()` を呼び出す際のパフォーマンスが大幅に向上しました。

## ドキュメントの更新

Kotlin のドキュメントにいくつかの注目すべき変更がありました。

### 刷新および追加されたページ

* [Gradle の概要](gradle.md) – Gradle ビルドシステムを使用した Kotlin プロジェクトの構成とビルド方法、利用可能なコンパイラオプション、コンパイル、および Kotlin Gradle プラグインのキャッシュについて学びます。
* [Java と Kotlin における Null 許容性（Nullability）](java-to-kotlin-nullability-guide.md) – Null 許容の可能性がある変数の扱いに対する Java と Kotlin のアプローチの違いを確認します。
* [Lincheck ガイド](lincheck-guide.md) – JVM 上で並行アルゴリズムをテストするための Lincheck フレームワークのセットアップと使用方法を学びます。

### 新規および更新されたチュートリアル

* [Gradle と Kotlin/JVM を使い始める](get-started-with-jvm-gradle-project.md) – IntelliJ IDEA と Gradle を使用してコンソールアプリケーションを作成します。
* [Ktor と SQLDelight を使用してマルチプラットフォームアプリを作成する](https://kotlinlang.org/docs/multiplatform/multiplatform-ktor-sqldelight.html) – Kotlin Multiplatform Mobile を使用して iOS および Android 向けのモバイルアプリケーションを作成します。
* [Kotlin Multiplatform を使い始める](https://kotlinlang.org/docs/multiplatform/multiplatform-create-first-app.html) – Kotlin によるクロスプラットフォームモバイル開発について学び、Android と iOS の両方で動作するアプリを作成します。

## Kotlin 1.8.0 のインストール

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2021.3、2022.1、および 2022.2 は、Kotlin プラグインをバージョン 1.8.0 に更新することを自動的に提案します。IntelliJ IDEA 2022.3 では、今後のマイナーアップデートで Kotlin プラグインのバージョン 1.8.0 がバンドルされる予定です。

> IntelliJ IDEA 2022.3 で既存のプロジェクトを Kotlin 1.8.0 に移行するには、Kotlin のバージョンを `1.8.0` に変更し、Gradle または Maven プロジェクトを再インポートしてください。
>
{style="note"}

Android Studio Electric Eel (221) および Flamingo (222) の場合、Kotlin プラグインのバージョン 1.8.0 は、今後の Android Studio のアップデートとともに提供されます。新しいコマンドラインコンパイラは、[GitHub のリリースページ](https://github.com/JetBrains/kotlin/releases/tag/v1.8.0) からダウンロード可能です。

## Kotlin 1.8.0 互換性ガイド

Kotlin 1.8.0 は [フィーチャーリリース](kotlin-evolution-principles.md#language-and-tooling-releases) であるため、以前のバージョンの言語で書かれたコードと互換性のない変更が行われる可能性があります。これらの変更の詳細なリストについては、[Kotlin 1.8.0 互換性ガイド](compatibility-guide-18.md) を参照してください。