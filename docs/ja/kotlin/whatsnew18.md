---
title: "Kotlin 1.8.0の新機能"
---
_[リリース日: 2022年12月28日](releases#release-details)_

Kotlin 1.8.0 リリースが公開されました。主なハイライトを以下に示します。

* [JVM 用の新しい試験的関数: ディレクトリの内容を再帰的にコピーまたは削除](#recursive-copying-or-deletion-of-directories)
* [kotlin-reflect のパフォーマンスの改善](#improved-kotlin-reflect-performance)
* [デバッグエクスペリエンスを向上させる新しい -Xdebug コンパイラオプション](#a-new-compiler-option-for-disabling-optimizations)
* [`kotlin-stdlib-jdk7` と `kotlin-stdlib-jdk8` が `kotlin-stdlib` にマージ](#updated-jvm-compilation-target)
* [Objective-C/Swift の相互運用性の改善](#improved-objective-c-swift-interoperability)
* [Gradle 7.3 との互換性](#gradle)

## IDE サポート

1.8.0 をサポートする Kotlin プラグインは、以下で使用できます。

| IDE            | サポートされているバージョン                 |
|----------------|------------------------------------|
| IntelliJ IDEA  | 2021.3、2022.1、2022.2             |
| Android Studio | Electric Eel (221)、Flamingo (222) |
:::note
IDE プラグインをアップデートしなくても、IntelliJ IDEA 2022.3 でプロジェクトを Kotlin 1.8.0 にアップデートできます。

既存のプロジェクトを IntelliJ IDEA 2022.3 で Kotlin 1.8.0 に移行するには、Kotlin のバージョンを `1.8.0` に変更して、Gradle または Maven プロジェクトを再インポートしてください。

:::

## Kotlin/JVM

バージョン 1.8.0 以降、コンパイラーは JVM 19 に対応するバイトコードバージョンを持つクラスを生成できます。
新しい言語バージョンには以下も含まれています。

* [JVM アノテーションターゲットの生成をオフにするコンパイラオプション](#ability-to-not-generate-type-use-and-type-parameter-annotation-targets)
* [最適化を無効にする新しい `-Xdebug` コンパイラオプション](#a-new-compiler-option-for-disabling-optimizations)
* [古いバックエンドの削除](#removal-of-the-old-backend)
* [Lombok の @Builder アノテーションのサポート](#support-for-lombok-s-builder-annotation)

### TYPE_USE および TYPE_PARAMETER アノテーションターゲットを生成しない機能

Kotlin アノテーションに Kotlin ターゲットの中に `TYPE` がある場合、アノテーションは Java アノテーションターゲットのリストにある `java.lang.annotation.ElementType.TYPE_USE` にマップされます。これは、`TYPE_PARAMETER` Kotlin ターゲットが `java.lang.annotation.ElementType.TYPE_PARAMETER` Java ターゲットにマップされるのと同様です。これは、API レベルが 26 未満の Android クライアントにとって問題です。API にこれらのターゲットがないためです。

Kotlin 1.8.0 以降では、新しいコンパイラーオプション `-Xno-new-java-annotation-targets` を使用して、`TYPE_USE` および `TYPE_PARAMETER` アノテーションターゲットの生成を回避できます。

### 最適化を無効にする新しいコンパイラオプション

Kotlin 1.8.0 では、新しい `-Xdebug` コンパイラオプションが追加されました。これにより、デバッグエクスペリエンスを向上させるために最適化が無効になります。
今のところ、このオプションはコルーチンの "最適化により削除されました" 機能を無効にします。今後、最適化を追加した後、このオプションはそれらも無効にします。

"最適化により削除されました" 機能は、suspend 関数を使用するときに変数を最適化します。ただし、最適化された変数の値が表示されないため、最適化された変数を含むコードをデバッグするのは困難です。

:::note
**本番環境ではこのオプションを絶対に使用しないでください**: `-Xdebug` を介してこの機能を無効にすると、[メモリリークが発生する可能性](https://youtrack.jetbrains.com/issue/KT-48678/Coroutine-debugger-disable-was-optimised-out-compiler-feature#focus=Comments-27-6015585.0-0)があります。

### 古いバックエンドの削除

Kotlin 1.5.0 で、IR ベースのバックエンドが [Stable](components-stability) になったことを[発表](whatsnew15#stable-jvm-ir-backend)しました。
つまり、Kotlin 1.4.* の古いバックエンドは非推奨になりました。Kotlin 1.8.0 では、古いバックエンドを完全に削除しました。
拡張機能として、コンパイラオプション `-Xuse-old-backend` と Gradle `useOldBackend` オプションを削除しました。

### Lombok の @Builder アノテーションのサポート

コミュニティは [Kotlin Lombok: 生成されたビルダーのサポート (@Builder)](https://youtrack.jetbrains.com/issue/KT-46959) YouTrack issue に非常に多くの票を投じたため、[@Builder アノテーション](https://projectlombok.org/features/Builder)をサポートする必要がありました。

現時点では、`@SuperBuilder` または `@Tolerate` アノテーションをサポートする予定はありませんが、十分な人が [@SuperBuilder](https://youtrack.jetbrains.com/issue/KT-53563/Kotlin-Lombok-Support-SuperBuilder) および [@Tolerate](https://youtrack.jetbrains.com/issue/KT-53564/Kotlin-Lombok-Support-Tolerate) issue に投票した場合、再検討します。

[Lombok コンパイラプラグインの設定方法をご覧ください](lombok#gradle)。

## Kotlin/Native

Kotlin 1.8.0 には、Objective-C および Swift の相互運用性、Xcode 14.1 のサポート、および CocoaPods Gradle プラグインの改善が含まれています。

* [Xcode 14.1 のサポート](#support-for-xcode-14-1)
* [Objective-C/Swift の相互運用性の改善](#improved-objective-c-swift-interoperability)
* [CocoaPods Gradle プラグインのデフォルトの動的フレームワーク](#dynamic-frameworks-by-default-in-the-cocoapods-gradle-plugin)

### Xcode 14.1 のサポート

Kotlin/Native コンパイラーは、最新の安定版 Xcode バージョン 14.1 をサポートするようになりました。互換性の改善には、次の変更が含まれます。

* ARM64 プラットフォーム上の Apple watchOS をサポートする watchOS ターゲット用の新しい `watchosDeviceArm64` プリセットがあります。
* Kotlin CocoaPods Gradle プラグインには、デフォルトで Apple フレームワークのビットコード埋め込みが含まれなくなりました。
* プラットフォームライブラリが更新され、Apple ターゲットの Objective-C フレームワークへの変更が反映されました。

### Objective-C/Swift の相互運用性の改善

Kotlin を Objective-C および Swift とより相互運用できるようにするために、3 つの新しいアノテーションが追加されました。

* [`@ObjCName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-obj-c-name/) を使用すると、Kotlin 宣言の名前を変更する代わりに、Swift または Objective-C でより慣用的な名前を指定できます。

  このアノテーションは、このクラス、プロパティ、パラメーター、または関数にカスタム Objective-C および Swift 名を使用するように Kotlin コンパイラーに指示します。

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

* [`@HiddenFromObjC`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-hidden-from-obj-c/) を使用すると、Kotlin 宣言を Objective-C から非表示にできます。

  このアノテーションは、関数またはプロパティを Objective-C (したがって Swift) にエクスポートしないように Kotlin コンパイラーに指示します。
  これにより、Kotlin コードを Objective-C/Swift フレンドリーにすることができます。

* [`@ShouldRefineInSwift`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-should-refine-in-swift/) は、Kotlin 宣言を Swift で記述されたラッパーに置き換える場合に役立ちます。

  このアノテーションは、生成された Objective-C API で関数またはプロパティを `swift_private` としてマークするように Kotlin コンパイラーに指示します。このような宣言には `__` プレフィックスが付き、Swift コードには表示されなくなります。

  これらの宣言を Swift コードで使用して Swift フレンドリーな API を作成できますが、たとえば、Xcode のオートコンプリートでは推奨されません。

  Swift での Objective-C 宣言の改良の詳細については、[公式 Apple ドキュメント](https://developer.apple.com/documentation/swift/improving-objective-c-api-declarations-for-swift)を参照してください。

新しいアノテーションには [オプトイン](opt-in-requirements) が必要です。

:::

Kotlin チームは、これらのアノテーションを実装してくれた [Rick Clephas](https://github.com/rickclephas) に非常に感謝しています。

### CocoaPods Gradle プラグインのデフォルトの動的フレームワーク

Kotlin 1.8.0 以降、CocoaPods Gradle プラグインによって登録された Kotlin フレームワークは、デフォルトで動的にリンクされます。以前の静的実装は、Kotlin Gradle プラグインの動作と一致していませんでした。

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

静的リンクタイプを持つ既存のプロジェクトがあり、Kotlin 1.8.0 にアップグレードする場合 (またはリンクタイプを明示的に変更する場合)、プロジェクトの実行でエラーが発生する可能性があります。修正するには、Xcode プロジェクトを閉じて、Podfile ディレクトリで `pod install` を実行します。

詳細については、[CocoaPods Gradle プラグイン DSL リファレンス](native-cocoapods-dsl-reference)を参照してください。

## Kotlin Multiplatform: 新しい Android ソースセットレイアウト

Kotlin 1.8.0 では、Android ソースセットの新しいレイアウトが導入されました。これにより、ディレクトリの以前の命名スキーマが置き換えられます。これは、複数の点で紛らわしいものです。

現在のレイアウトで作成された 2 つの `androidTest` ディレクトリの例を考えてみましょう。1 つは `KotlinSourceSets` 用で、もう 1 つは `AndroidSourceSets` 用です。

* これらは異なるセマンティクスを持ちます。Kotlin の `androidTest` は `unitTest` タイプに属しますが、Android の `androidTest` は `integrationTest` タイプに属します。
* これらは、混乱を招く `SourceDirectories` レイアウトを作成します。`src/androidTest/kotlin` は `UnitTest` を持ち、`src/androidTest/java` は `InstrumentedTest` を持ちます。
* `KotlinSourceSets` と `AndroidSourceSets` の両方が Gradle 構成に同様の命名スキーマを使用しているため、Kotlin と Android のソースセットの両方の `androidTest` の結果の構成は同じです: `androidTestImplementation`、`androidTestApi`、`androidTestRuntimeOnly`、および `androidTestCompileOnly`。

これらの既存の問題やその他の問題を解決するために、新しい Android ソースセットレイアウトを導入しました。
2 つのレイアウトの主な違いを次に示します。

#### KotlinSourceSet 命名スキーマ

| 現在のソースセットレイアウト              | 新しいソースセットレイアウト               |
|----------------------------------------|-------------------------------------|
| `targetName` + `AndroidSourceSet.name` | `targetName` + `AndroidVariantType` |

`{AndroidSourceSet.name}` は `{KotlinSourceSet.name}` に次のようにマップされます。

|             | 現在のソースセットレイアウト | 新しいソースセットレイアウト          |
|-------------|---------------------------|--------------------------------|
| main        | androidMain               | androidMain                    |
| test        | androidTest               | android<b>Unit</b>Test         |
| androidTest | android<b>Android</b>Test | android<b>Instrumented</b>Test |

#### SourceDirectories

| 現在のソースセットレイアウト                               | 新しいソースセットレイアウト                                                     |
|---------------------------------------------------------|---------------------------------------------------------------------------|
| レイアウトは追加の `/kotlin` SourceDirectories を追加します  | `src/{AndroidSourceSet.name}/kotlin`、`src/{KotlinSourceSet.name}/kotlin` |

`{AndroidSourceSet.name}` は `{SourceDirectories included}` に次のようにマップされます。

|             | 現在のソースセットレイアウト                                  | 新しいソースセットレイアウト                                                                          |
|-------------|------------------------------------------------------------|------------------------------------------------------------------------------------------------|
| main        | src/androidMain/kotlin、src/main/kotlin、src/main/java     | src/androidMain/kotlin、src/main/kotlin、src/main/java                                         |
| test        | src/androidTest/kotlin、src/test/kotlin、src/test/java     | src/android<b>Unit</b>Test/kotlin、src/test/kotlin、src/test/java                              |
| androidTest | src/android<b>Android</b>Test/kotlin、src/androidTest/java | src/android<b>Instrumented</b>Test/kotlin、src/androidTest/java、<b>src/androidTest/kotlin</b> |

#### AndroidManifest.xml ファイルの場所

| 現在のソースセットレイアウト                              | 新しいソースセットレイアウト                                 |
|--------------------------------------------------------|-------------------------------------------------------|
| src/**Android**SourceSet.name/AndroidManifest.xml | src/**Kotlin**SourceSet.name/AndroidManifest.xml |

`{AndroidSourceSet.name}` は `{AndroidManifest.xml location}` に次のようにマップされます。

|       | 現在のソースセットレイアウト     | 新しいソースセットレイアウト                       |
|-------|-------------------------------|---------------------------------------------|
| main  | src/main/AndroidManifest.xml  | src/<b>android</b>Main/AndroidManifest.xml  |
| debug | src/debug/AndroidManifest.xml | src/<b>android</b>Debug/AndroidManifest.xml |

#### Android テストと共通テストの関係

新しい Android ソースセットレイアウトは、Android 計測テスト (新しいレイアウトでは `androidInstrumentedTest` に名前が変更されました) と共通テストの関係を変更します。

以前は、`androidAndroidTest` と `commonTest` の間にデフォルトの `dependsOn` 関係がありました。実際には、次のことを意味しました。

* `commonTest` のコードは `androidAndroidTest` で使用できました。
* `commonTest` の `expect` 宣言には、`androidAndroidTest` に対応する `actual` 実装が必要です。
* `commonTest` で宣言されたテストも Android 計測テストとして実行されていました。

新しい Android ソースセットレイアウトでは、`dependsOn` 関係はデフォルトで追加されません。以前の動作が必要な場合は、`build.gradle.kts` ファイルでこの関係を手動で宣言してください。

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

以前は、Kotlin Gradle プラグインは、`debug` および `release` ビルドタイプまたは `demo` や `full` などのカスタムフレーバーを使用して、Android ソースセットに対応するソースセットを積極的に作成していました。
これにより、`val androidDebug by getting { ... }` のような構成でアクセスできるようになりました。

新しい Android ソースセットレイアウトでは、これらのソースセットは `afterEvaluate` フェーズで作成されます。これにより、このような式が無効になり、`org.gradle.api.UnknownDomainObjectException: KotlinSourceSet with name 'androidDebug' not found` のようなエラーが発生します。

これを回避するには、`build.gradle.kts` ファイルで新しい `invokeWhenCreated()` API を使用してください。

```kotlin
kotlin {
    // ...
    sourceSets.invokeWhenCreated("androidFreeDebug") {
        // ...
    }
}
```

### 構成とセットアップ

新しいレイアウトは、将来のリリースでデフォルトになります。次の Gradle オプションを使用して、今すぐ有効にできます。

```none
kotlin.mpp.androidSourceSetLayoutVersion=2
```

:::note
新しいレイアウトには、Android Gradle プラグイン 7.0 以降が必要で、Android Studio 2022.3 以降でサポートされています。

:::

以前の Android スタイルのディレクトリの使用は推奨されなくなりました。Kotlin 1.8.0 は、現在のレイアウトの警告を導入する、非推奨サイクルの開始を示しています。次の Gradle プロパティを使用して、警告を抑制できます。

```none
kotlin.mpp.androidSourceSetLayoutVersion1.nowarn=true
```

## Kotlin/JS

Kotlin 1.8.0 は、JS IR コンパイラーバックエンドを安定化し、JavaScript 関連の Gradle ビルドスクリプトに新機能をもたらします。
* [安定した JS IR コンパイラーバックエンド](#stable-js-ir-compiler-backend)
* [yarn.lock が更新されたことを報告するための新しい設定](#new-settings-for-reporting-that-yarn-lock-has-been-updated)
* [Gradle プロパティを介してブラウザーのテストターゲットを追加する](#add-test-targets-for-browsers-via-gradle-properties)
* [プロジェクトに CSS サポートを追加する新しいアプローチ](#new-approach-to-adding-css-support-to-your-project)

### 安定した JS IR コンパイラーバックエンド

今回のリリースから、[Kotlin/JS 中間表現 (IR ベース) コンパイラー](js-ir-compiler)バックエンドは Stable です。
3 つのバックエンドすべてのインフラストラクチャを統合するには時間がかかりましたが、Kotlin コードには同じ IR が使用されるようになりました。

安定した JS IR コンパイラーバックエンドの結果として、古いコンパイラーは現在非推奨になりました。

インクリメンタルコンパイルは、安定した JS IR コンパイラーとともにデフォルトで有効になっています。

古いコンパイラーをまだ使用している場合は、[移行ガイド](js-ir-migration)を使用してプロジェクトを新しいバックエンドに切り替えてください。

### yarn.lock が更新されたことを報告するための新しい設定

`yarn` パッケージマネージャーを使用している場合、`yarn.lock` ファイルが更新された場合に通知する 3 つの新しい特別な Gradle 設定があります。
CI ビルドプロセス中に `yarn.lock` がサイレントに変更された場合に通知を受けたい場合は、これらの設定を使用できます。

これら 3 つの新しい Gradle プロパティは次のとおりです。

* `YarnLockMismatchReport`: `yarn.lock` ファイルへの変更がどのように報告されるかを指定します。次のいずれかの値を使用できます。
    * `FAIL` は、対応する Gradle タスクを失敗させます。これはデフォルトです。
    * `WARNING` は、変更に関する情報を警告ログに書き込みます。
    * `NONE` はレポートを無効にします。
* `reportNewYarnLock`: 最近作成された `yarn.lock` ファイルについて明示的に報告します。デフォルトでは、このオプションは無効になっています。これは、最初の起動時に新しい `yarn.lock` ファイルを生成するのが一般的な方法であるためです。このオプションを使用すると、ファイルがリポジトリにコミットされていることを確認できます。
* `yarnLockAutoReplace`: Gradle タスクが実行されるたびに `yarn.lock` を自動的に置き換えます。

これらのオプションを使用するには、ビルドスクリプトファイル `build.gradle.kts` を次のように更新します。

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnLockMismatchReport
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension

rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin::class.java) \{
    rootProject.the<YarnRootExtension>().yarnLockMismatchReport =
        YarnLockMismatchReport.WARNING // NONE | FAIL
    rootProject.the<YarnRootExtension>().reportNewYarnLock = false // true
    rootProject.the<YarnRootExtension>().yarnLockAutoReplace = false // true
\}
```

### Gradle プロパティを介してブラウザーのテストターゲットを追加する

Kotlin 1.8.0 以降では、Gradle プロパティファイルでさまざまなブラウザーのテストターゲットを直接設定できます。
これにより、`build.gradle.kts` ですべてのターゲットを記述する必要がなくなるため、ビルドスクリプトファイルのサイズが縮小されます。

このプロパティを使用すると、すべてのモジュールのブラウザーのリストを定義し、特定のモジュールのビルドスクリプトに特定のブラウザーを追加できます。

たとえば、Gradle プロパティファイル内の次の行は、すべてのモジュールに対して Firefox と Safari でテストを実行します。

```none
kotlin.js.browser.karma.browsers=firefox,safari
```

[GitHub でプロパティに使用できる値の完全なリスト](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/js/testing/karma/KotlinKarma.kt#L106) を参照してください。

Kotlin チームは、この機能を実装してくれた [Martynas Petuška](https://github.com/mpetuska) に非常に感謝しています。

### プロジェクトに CSS サポートを追加する新しいアプローチ

このリリースでは、プロジェクトに CSS サポートを追加するための新しいアプローチが提供されます。これは多くのプロジェクトに影響を与える可能性があると想定されるため、以下に説明するように Gradle ビルドスクリプトファイルを更新することを忘れないでください。

Kotlin 1.8.0 より前は、`cssSupport.enabled` プロパティを使用して CSS サポートを追加していました。

```kotlin
browser {
    commonWebpackConfig {
        cssSupport.enabled = true
    }
}
```

これで、`cssSupport {}` ブロックで `enabled.set()` メソッドを使用する必要があります。

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

Kotlin 1.8.0 は Gradle バージョン 7.2 および 7.3 を**完全に**サポートしています。最新の Gradle リリースまでの Gradle バージョンも使用できますが、その場合は、非推奨の警告が発生したり、一部の新しい Gradle 機能が動作しない可能性があることに注意してください。

このバージョンには多くの変更があります。
* [Kotlin コンパイラーオプションを Gradle 遅延プロパティとして公開する](#exposing-kotlin-compiler-options-as-gradle-lazy-properties)
* [サポートされている最小バージョンの引き上げ](#bumping-the-minimum-supported-versions)
* [Kotlin デーモンフォールバック戦略を無効にする機能](#ability-to-disable-the-kotlin-daemon-fallback-strategy)
* [推移的な依存関係での最新の kotlin-stdlib バージョンの使用](#usage-of-the-latest-kotlin-stdlib-version-in-transitive-dependencies)
* [関連する Kotlin および Java コンパイルタスクの JVM ターゲット互換性の平等に対する義務的なチェック](#obligatory-check-for-jvm-targets-of-related-kotlin-and-java-compile-tasks)
* [Kotlin Gradle プラグインの推移的な依存関係の解決](#resolution-of-kotlin-gradle-plugins-transitive-dependencies)
* [非推奨と削除](#deprecations-and-removals)

### Kotlin コンパイラーオプションを Gradle 遅延プロパティとして公開する

使用可能な Kotlin コンパイラーオプションを [Gradle 遅延プロパティ](https://docs.gradle.org/current/userguide/lazy_configuration.html)として公開し、Kotlin タスクに適切に統合するために、多くの変更を加えました。

* コンパイルタスクには、既存の `kotlinOptions` と同様の新しい `compilerOptions` 入力がありますが、Gradle Properties API から [`Property`](https://docs.gradle.org/current/javadoc/org/gradle/api/provider/Property.html) を戻り値の型として使用します。

  ```kotlin
  tasks.named("compileKotlin", org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile::class.java) {
      compilerOptions {
          useK2.set(true)
      }
  }
  ```

* Kotlin ツールタスク `KotlinJsDce` および `KotlinNativeLink` には、既存の `kotlinOptions` 入力と同様の新しい `toolOptions` 入力があります。
* 新しい入力には [`@Nested` Gradle アノテーション](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/Nested.html) があります。入力内のすべてのプロパティには、[`@Input` または `@Internal`](https://docs.gradle.org/current/userguide/more_about_tasks.html#sec:up_to_date_checks) などの関連する Gradle アノテーションがあります。
* Kotlin Gradle プラグイン API アーティファクトには、2 つの新しいインターフェースがあります。
    * `org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask`: `compilerOptions` 入力と `compileOptions()` メソッドがあります。すべての Kotlin コンパイルタスクは、このインターフェースを実装します。
    * `org.jetbrains.kotlin.gradle.tasks.KotlinToolTask`: `toolOptions` 入力と `toolOptions()` メソッドがあります。すべての Kotlin ツールタスク (`KotlinJsDce`、`KotlinNativeLink`、および `KotlinNativeLinkArtifactTask`) は、このインターフェースを実装します。
* 一部の `compilerOptions` は、`String` 型の代わりに新しい型を使用します。
    * [`JvmTarget`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JvmTarget.kt)
    * [`KotlinVersion`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/KotlinVersion.kt)
      (`apiVersion` および `languageVersion` 入力用)
    * [`JsMainFunctionExecutionMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsMainFunctionExecutionMode.kt)
    * [`JsModuleKind`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsModuleKind.kt)
    * [`JsSourceMapEmbedMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapEmbedMode.kt)

  たとえば、`kotlinOptions.jvmTarget = "11"` の代わりに `compilerOptions.jvmTarget.set(JvmTarget.JVM_11)` を使用できます。

  `kotlinOptions` の型は変更されず、内部的に `compilerOptions` の型に変換されます。
* Kotlin Gradle プラグイン API は、以前のリリースとバイナリ互換性があります。ただし、`kotlin-gradle-plugin` アーティファクトには、ソースおよび ABI を中断する変更がいくつかあります。これらの変更のほとんどは、一部の内部型への追加の汎用パラメーターを含みます。1 つの重要な変更は、`KotlinNativeLink` タスクが `AbstractKotlinNativeCompile` タスクを継承しなくなったことです。
* `KotlinJsCompilerOptions.outputFile` および関連する `KotlinJsOptions.outputFile` オプションは非推奨になりました。代わりに `Kotlin2JsCompile.outputFileProperty` タスク入力を使用してください。

:::note
Kotlin Gradle プラグインは、Android 拡張機能に `KotlinJvmOptions` DSL を引き続き追加します。

```kotlin
android { 
    kotlinOptions {
        jvmTarget = "11"
    }
}
```

これは、[この issue](https://youtrack.jetbrains.com/issue/KT-15370/Gradle-DSL-add-module-level-kotlin-options) の範囲内で変更されます。
`compilerOptions` DSL がモジュールレベルに追加されると。

:::

#### 制限事項

:::note
`kotlinOptions` タスク入力と `kotlinOptions{...}` タスク DSL はサポートモードであり、今後のリリースで非推奨になります。
改善は `compilerOptions` と `toolOptions` のみに行われます。

`kotlinOptions` でセッターまたはゲッターを呼び出すと、`compilerOptions` の関連プロパティに委譲されます。
これにより、次の制限が発生します。
* `compilerOptions` と `kotlinOptions` は、タスク実行フェーズで変更できません (以下の段落の 1 つの例外を参照してください)。
* `freeCompilerArgs` は変更不可能な `List<String>` を返します。つまり、たとえば、`kotlinOptions.freeCompilerArgs.remove("something")` は失敗します。

`kotlin-dsl` や、[Jetpack Compose](https://developer.android.com/jetpack/compose) が有効になっている Android Gradle プラグイン (AGP) などのいくつかのプラグインは、タスク実行フェーズで `freeCompilerArgs` 属性を変更しようとします。Kotlin 1.8.0 では、それらの回避策を追加しました。この回避策により、ビルドスクリプトまたはプラグインは実行フェーズで `kotlinOptions.freeCompilerArgs` を変更できますが、ビルドログに警告が表示されます。この警告を無効にするには、新しい Gradle プロパティ `kotlin.options.suppressFreeCompilerArgsModificationWarning=true` を使用します。Gradle は、[`kotlin-dsl` プラグイン](https://github.com/gradle/gradle/issues/22091) と [Jetpack Compose が有効になっている AGP](https://issuetracker.google.com/u/1/issues/247544167) の修正を追加する予定です。

### サポートされている最小バージョンの引き上げ

Kotlin 1.8.0 以降、サポートされている最小 Gradle バージョンは 6.8.3 で、サポートされている最小 Android Gradle プラグインバージョンは 4.1.3 です。

[ドキュメントで、使用可能な Gradle バージョンとの Kotlin Gradle プラグインの互換性を参照してください](gradle-configure-project#apply-the-plugin)

### Kotlin デーモンフォールバック戦略を無効にする機能

新しい Gradle プロパティ `kotlin.daemon.useFallbackStrategy` があります。そのデフォルト値は `true` です。値が `false` の場合、デーモンの起動または通信に関する問題でビルドが失敗します。Kotlin コンパイルタスクには新しい `useDaemonFallbackStrategy` プロパティもあり、両方を使用する場合は Gradle プロパティよりも優先されます。コンパイルを実行するのに十分なメモリがない場合は、ログにメッセージが表示されることがあります。

Kotlin コンパイラーのフォールバック戦略は、デーモンが何らかの理由で失敗した場合に Kotlin デーモンの外部でコンパイルを実行することです。Gradle デーモンがオンの場合、コンパイラーは "プロセス内" 戦略を使用します。Gradle デーモンがオフの場合、コンパイラーは "プロセス外" 戦略を使用します。これらの [実行戦略の詳細については、ドキュメント](gradle-compilation-and-caches#defining-kotlin-compiler-execution-strategy)を参照してください。別の戦略へのサイレントフォールバックは、多くのシステムリソースを消費したり、非決定的なビルドにつながる可能性があることに注意してください。詳細については、この [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-48843/Add-ability-to-disable-Kotlin-daemon-fallback-strategy) を参照してください。

### 推移的な依存関係での最新の kotlin-stdlib バージョンの使用

依存関係で Kotlin バージョン 1.8.0 以降を明示的に記述する場合 (例: `implementation("org.jetbrains.kotlin:kotlin-stdlib:1.8.0")`)、Kotlin Gradle プラグインは推移的な `kotlin-stdlib-jdk7` および `kotlin-stdlib-jdk8` 依存関係にその Kotlin バージョンを使用します。これは、異なる stdlib バージョンからのクラスの重複を避けるために行われます ([`kotlin-stdlib-jdk7` と `kotlin-stdlib-jdk8` を `kotlin-stdlib` にマージする](updated-jvm-compilation-target) の詳細を参照してください)。`kotlin.stdlib.jdk.variants.version.alignment` Gradle プロパティを使用して、この動作を無効にできます。

```none
kotlin.stdlib.jdk.variants.version.alignment=false
```

バージョンアラインメントで問題が発生した場合は、ビルドスクリプトで `kotlin-bom` のプラットフォーム依存関係を宣言することにより、Kotlin [BOM](https://docs.gradle.org/current/userguide/platforms.html#sub:bom_import) を介してすべてのバージョンをアラインします。

```kotlin
implementation(platform("org.jetbrains.kotlin:kotlin-bom:1.8.0"))
```

その他のケースと推奨される解決策については、[ドキュメント](gradle-configure-project#other-ways-to-align-versions)を参照してください。

### 関連する Kotlin および Java コンパイルタスクの JVM ターゲットの義務的なチェック

このセクションは、ソースファイルが Kotlin のみにあり、Java を使用していない場合でも、JVM プロジェクトに適用されます。

[今回のリリース以降](https://youtrack.jetbrains.com/issue/KT-54993/Raise-kotlin.jvm.target.validation.mode-check-default-level-to-error-when-build-is-running-on-Gradle-8)、[`kotlin.jvm.target.validation.mode` プロパティ](gradle-configure-project#check-for-jvm-target-compatibility-of-related-compile-tasks)のデフォルト値は Gradle 8.0+ (このバージョンの Gradle はまだリリースされていません) のプロジェクトでは `error` であり、プラグインは JVM ターゲットの非互換性が発生した場合にビルドを失敗させます。

デフォルト値を `warning` から `error` にシフトすることは、Gradle 8.0 へのスムーズな移行のための準備段階です。
**このプロパティを `error` に設定**し、[ツールチェーンを構成](gradle-configure-project#gradle-java-toolchains-support)するか、JVM バージョンを手動でアラインすることを推奨します。

[ターゲットの互換性を確認しない場合に何が起こりうるか](gradle-configure-project#what-can-go-wrong-if-targets-are-incompatible) の詳細をご覧ください。

### Kotlin Gradle プラグインの推移的な依存関係の解決

Kotlin 1.7.0 では、[Gradle プラグインバリアントのサポート](whatsnew17#support-for-gradle-plugin-variants)を導入しました。
これらのプラグインバリアントにより、ビルドクラスパスは、通常 `kotlin-gradle-plugin-api` の一部の依存関係の異なるバージョンに依存する、[Kotlin Gradle プラグイン](https://plugins.gradle.org/u/kotlin)の異なるバージョンを持つことができます。これにより、解決の問題が発生する可能性があります。ここでは、`kotlin-dsl` プラグインを例として使用して、次の回避策を提案します。

Gradle 7.6 の `kotlin-dsl`