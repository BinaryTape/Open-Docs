[//]: # (title: Kotlin 2.3 互換性ガイド)

_[言語をモダンに保つ](kotlin-evolution-principles.md)_ および _[快適なアップデート](kotlin-evolution-principles.md)_ は、Kotlin言語設計における基本的な原則です。前者は、言語の進化を妨げる構文は削除されるべきであり、後者は、コード移行を可能な限りスムーズにするために、この削除が事前に十分に伝えられるべきであると述べています。

言語の変更点のほとんどは、更新チェンジログやコンパイラの警告など、他のチャネルですでに発表されていますが、このドキュメントはそれらすべてを要約し、Kotlin 2.2からKotlin 2.3への移行のための完全なリファレンスを提供します。このドキュメントには、ツール関連の変更に関する情報も含まれています。

## 基本用語

このドキュメントでは、いくつかの種類の互換性について説明します。

- _ソース_: ソース非互換の変更により、以前は問題なく（エラーや警告なしで）コンパイルできていたコードが、それ以上コンパイルできなくなります。
- _バイナリ_: 2つのバイナリアーティファクトは、それらを入れ替えてもロードエラーやリンケージエラーが発生しない場合、バイナリ互換であると見なされます。
- _動作_: 変更が動作非互換であるとされるのは、同じプログラムが変更適用前後で異なる動作を示す場合です。

これらの定義は、純粋なKotlinのみに与えられていることに注意してください。他の言語の視点（例えばJavaから）からのKotlinコードの互換性は、このドキュメントの範囲外です。

## 言語

### `-language-version` で 1.8 および 1.9 のサポートを終了

> **課題**: [KT-76343](https://youtrack.jetbrains.com/issue/KT-76343), [KT-76344](https://youtrack.jetbrains.com/issue/KT-76344).
>
> **コンポーネント**: コンパイラ
>
> **非互換変更タイプ**: ソース
>
> **概要**: Kotlin 2.3 から、コンパイラは [`-language-version=1.8`](compiler-reference.md#language-version-version) をサポートしなくなります。
> `-language-version=1.9` のサポートも非JVMプラットフォーム向けに削除されます。
>
> **非推奨サイクル**:
>
> - 2.2.0: `-language-version` をバージョン 1.8 および 1.9 と共に使用すると警告を報告する
> - 2.3.0: すべてのプラットフォームでバージョン 1.8 の `-language-version`、および非JVMプラットフォームでバージョン 1.9 の警告をエラーに昇格する

### 型エイリアスを使用した推論型に対する上限制約違反エラーを報告

> **課題**: [KTLC-287](https://youtrack.jetbrains.com/issue/KTLC-287)
>
> **コンポーネント**: コア言語
>
> **非互換変更タイプ**: ソース
>
> **概要**: 以前は、コンパイラは推論型に対する上限違反制約に関するエラーを報告しませんでした。
> Kotlin 2.3.0 でこの問題が修正され、すべての型パラメータでエラーが一貫して報告されるようになりました。
>
> **非推奨サイクル**:
>
> - 2.2.20: 暗黙的な型引数による境界違反に対する非推奨警告を報告する
> - 2.3.0: 暗黙的な型引数に対する `UPPER_BOUND_VIOLATED` 警告をエラーに昇格する

### `inline` および `crossinline` ラムダでの `@JvmSerializableLambda` アノテーションを禁止

> **課題**: [KTLC-9](https://youtrack.jetbrains.com/issue/KTLC-9)
>
> **コンポーネント**: コア言語
>
> **非互換変更タイプ**: ソース
>
> **概要**: `inline` または `crossinline` ラムダに `@JvmSerializableLambda` アノテーションを適用できなくなりました。
> これらのラムダはシリアル化可能ではないため、`@JvmSerializableLambda` を適用しても効果はありませんでした。
>
> **非推奨サイクル**:
>
> - 2.1.20: `inline` および `crossinline` ラムダに `@JvmSerializableLambda` が適用された場合に警告を報告する
> - 2.3.0: 警告をエラーに昇格する。この変更はプログレッシブモードで有効にできます。

### ジェネリックシグネチャが一致しない場合にKotlinインターフェースをJavaクラスにデリゲートすることを禁止

> **課題**: [KTLC-267](https://youtrack.jetbrains.com/issue/KTLC-267)
>
> **コンポーネント**: コア言語
>
> **非互換変更タイプ**: ソース
>
> **概要**: Kotlin 2.3.0 では、ジェネリックインターフェースメソッドを非ジェネリックでオーバーライドするJavaクラスへのデリゲートを禁止します。
> 以前は、この動作を許可すると、型不一致や実行時における `ClassCastException` が報告されていました。
> この変更により、エラーが実行時ではなくコンパイル時に報告されるようになります。
>
> **非推奨サイクル**:
>
> - 2.1.20: 警告を報告する
> - 2.3.0: 警告をエラーに昇格する

### 明示的な戻り値型を持たない式本体関数での `return` の使用を非推奨化

> **課題**: [KTLC-288](https://youtrack.jetbrains.com/issue/KTLC-288)
>
> **コンポーネント**: コア言語
>
> **非互換変更タイプ**: ソース
>
> **概要**: 関数の戻り値型が明示的に宣言されていない場合、Kotlin は式本体内での `return` の使用を非推奨とします。
>
> **非推奨サイクル**:
>
> - 2.3.0: 警告を報告する
> - 2.4.0: 警告をエラーに昇格する

### 型エイリアスを介して導入された nullable なスーパークラスからの継承を禁止

> **課題**: [KTLC-279](https://youtrack.jetbrains.com/issue/KTLC-279)
>
> **コンポーネント**: コア言語
>
> **非互換変更タイプ**: ソース
>
> **概要**: Kotlin は、nullable な型エイリアスからの継承を試みるときにエラーを報告するようになりました。これは、
> 直接の nullable なスーパークラスを処理する方法と一貫しています。
>
> **非推奨サイクル**:
>
> - 2.2.0: 警告を報告する
> - 2.3.0: 警告をエラーに昇格する

### トップレベルラムダと呼び出し引数に対するジェネリックシグネチャ生成を統一

> **課題**: [KTLC-277](https://youtrack.jetbrains.com/issue/KTLC-277)
>
> **コンポーネント**: リフレクション
>
> **非互換変更タイプ**: 動作
>
> **概要**: Kotlin 2.3.0 では、トップレベルラムダに対して、呼び出し引数として渡されるラムダと同じ型チェックロジックを使用し、両方のケースで一貫したジェネリックシグネチャ生成を保証します。
>
> **非推奨サイクル**:
>
> - 2.3.0: 新しい動作を導入する。プログレッシブモードでは適用されない。

### 具体化された型パラメータが交差型として推論されるのを禁止

> **課題**: [KTLC-13](https://youtrack.jetbrains.com/issue/KTLC-13)
>
> **コンポーネント**: コア言語
>
> **非互換変更タイプ**: ソース
>
> **概要**: Kotlin 2.3.0 では、具体化された型パラメータが交差型に推論される状況を禁止します。
> これは、誤った実行時動作につながる可能性があるためです。
>
> **非推奨サイクル**:
>
> - 2.1.0: 具体化された型パラメータが交差型として推論された場合に警告を報告する
> - 2.3.0: 警告をエラーに昇格する

### 型パラメータ境界を介して視認性の低い型を公開することを禁止

> **課題**: [KTLC-275](https://youtrack.com/issue/KTLC-275)
>
> **コンポーネント**: コア言語
>
> **非互換変更タイプ**: ソース
>
> **概要**: Kotlin 2.3.0 では、関数または宣言自体よりも制限の厳しい視認性を持つ型を公開する型パラメータ境界の使用を禁止し、関数のルールを既にクラスに適用されているルールと一致させます。
>
> **非推奨サイクル**:
>
> - 2.1.0: 問題のある型パラメータ境界について警告を報告する
> - 2.3.0: 警告をエラーに昇格する

## 標準ライブラリ

### Charから数値への変換を非推奨化し、明示的な桁およびコードAPIを導入

> **課題**: [KTLC-321](https://youtrack.jetbrains.com/issue/KTLC-321)
>
> **コンポーネント**: kotlin-stdlib
>
> **非互換変更タイプ**: ソース
>
> **概要**: Kotlin 2.3.0 では、数値型に対する `Char.toX()` および `X.toChar()` 変換を非推奨とし、新しい明示的なAPIを導入して文字のコード値および桁値にアクセスできるようにします。
>
> **非推奨サイクル**:
>
> - 1.4.30: 新しい関数をExperimentalとして導入する
> - 1.5.0: 新しい関数をStableに昇格する。古い関数については、代替の提案とともに警告を報告する。
> - 2.3.0: 警告をエラーに昇格する

### `Number.toChar()` 関数を非推奨化

> **課題**: [KT-56822](https://youtrack.jetbrains.com/issue/KT-56822)
>
> **コンポーネント**: kotlin-stdlib
>
> **非互換変更タイプ**: ソース
>
> **概要**: `Number.toChar()` 関数は非推奨です。代わりに `toInt().toChar()` または `Char` コンストラクタを使用してください。
>
> **非推奨サイクル**:
>
> - 1.9.0: `Number.toChar()` 関数を使用すると警告を報告する
> - 2.3.0: 警告をエラーに昇格する

### `String.subSequence(start, end)` 関数を非推奨化

> **課題**: [KTLC-282](https://youtrack.jetbrains.com/issue/KTLC-282)
>
> **コンポーネント**: kotlin-stdlib
>
> **非互換変更タイプ**: ソース
>
> **概要**: `String.subSequence(start, end)` 関数は非推奨です。代わりに [`String.subSequence(startIndex, endIndex)`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-string/sub-sequence.html) 関数を使用してください。
>
> **非推奨サイクル**:
>
> - 1.0: `String.subSequence(start, end)` を使用すると警告を報告する
> - 2.3.0: 警告をエラーに昇格する

### `kotlin.io.createTempDirectory()` および `kotlin.io.createTempFile()` 関数を非推奨化

> **課題**: [KTLC-281](https://youtrack.jetbrains.com/issue/KTLC-281)
>
> **コンポーネント**: kotlin-stdlib
>
> **非互換変更タイプ**: ソース
>
> **概要**: `kotlin.io.createTempDirectory()` および `kotlin.io.createTempFile()` 関数は非推奨です。
> 代わりに [`kotlin.io.path.createTempDirectory()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.path/create-temp-directory.html) および [`kotlin.io.path.createTempFile()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.path/create-temp-file.html) 関数を使用してください。
>
> **非推奨サイクル**:
>
> - 1.4.20: `kotlin.io.createTempDirectory()` および `kotlin.io.createTempFile()` 関数を使用すると警告を報告する
> - 2.3.0: 警告をエラーに昇格する

### `InputStream.readBytes(Int)` 関数を非表示に

> **課題**: [KTLC-280](https://youtrack.jetbrains.com/issue/KTLC-280)
>
> **コンポーネント**: kotlin-stdlib
>
> **非互換変更タイプ**: ソース
>
> **概要**: 長い間非推奨となっていた `InputStream.readBytes(estimatedSize: Int = DEFAULT_BUFFER_SIZE): ByteArray` 関数が非表示になりました。
>
> **非推奨サイクル**:
>
> - 1.3.0: 警告を報告する
> - 1.5.0: 警告をエラーに昇格する
> - 2.3.0: 関数を非表示にする

### Kotlin/Nativeのスタックトレース出力と他のプラットフォームを統一

> **課題**: [KT-81431](https://youtrack.jetbrains.com/issue/KT-81431)
>
> **コンポーネント**: Kotlin/Native
>
> **非互換変更タイプ**: 動作
>
> **概要**: 例外スタックトレースをフォーマットする際、同じ例外原因が既に表示されている場合、追加の原因は出力されません。
>
> **非推奨サイクル**:
>
> - 2.3.20: Kotlin/Nativeの例外スタックトレースフォーマットを他のKotlinプラットフォームと統一する

### `Iterable<T>.intersect()` および `Iterable<T>.subtract()` の動作を修正

> **課題**: [KTLC-268](https://youtrack.jetbrains.com/issue/KTLC-268)
>
> **コンポーネント**: kotlin-stdlib
>
> **非互換変更タイプ**: 動作
>
> **概要**: [`Iterable<T>.intersect()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/intersect.html) および [`Iterable<T>.subtract()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/subtract.html) 関数は、各レシーバー要素を結果セットに追加する前にメンバーシップをテストするようになりました。結果セットは `Any::equals` を使用して要素を比較し、引数コレクションが参照等価性（例: `IdentityHashMap.keys`）を使用している場合でも正しい結果を保証します。
>
> **非推奨サイクル**:
>
> - 2.3.0: 新しい動作を有効にする

## ツール

### `kotlin-dsl` および `kotlin("jvm")` プラグイン使用時のサポートされていないKGPバージョン警告

> **課題**: [KT-79851](https://youtrack.jetbrains.com/issue/KT-79851)
>
> **コンポーネント**: Gradle
>
> **非互換変更タイプ**: 動作
>
> **概要**: Kotlin 2.3 では、Gradleプロジェクトで `kotlin-dsl` **と** `kotlin("jvm")` プラグインの両方を使用している場合、サポートされていないKotlin Gradleプラグイン（KGP）バージョンに関するGradle警告が表示されることがあります。
>
> **移行手順**:
>
> 一般に、同じGradleプロジェクトで `kotlin-dsl` と `kotlin("jvm")` プラグインの両方を使用することはお勧めしません。この設定はサポートされていません。
>
> コンベンションプラグイン、事前コンパイル済みスクリプトプラグイン、またはその他の形式の未公開ビルドロジックの場合、3つの選択肢があります。
>
> 1.  `kotlin("jvm")` プラグインを明示的に適用しないでください。代わりに、`kotlin-dsl` プラグインに互換性のあるKGPバージョンを自動的に提供させてください。
> 2.  `kotlin("jvm")` プラグインを明示的に適用したい場合は、[`embeddedKotlinVersion`](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.kotlin.dsl/embedded-kotlin-version.html) 定数を使用して組み込みのKotlinバージョンを指定してください。
>
>     組み込みのKotlinおよび言語バージョンをアップグレードするには、Gradleバージョンを更新してください。互換性のあるGradleバージョンは、Gradleの[Kotlinとの互換性ノート](https://docs.gradle.org/current/userguide/compatibility.html#kotlin)で確認できます。
>
> 3.  `kotlin-dsl` プラグインを使用しないでください。これは、特定のGradleバージョンに縛られないバイナリプラグインに適している場合があります。
>
> 最後の手段として、`kotlin-dsl` プラグインの競合する動作を上書きするために、言語バージョン2.1以降を使用するようにプロジェクトを設定できます。ただし、これを行うことは強く推奨しません。
>
> 移行中に問題が発生した場合は、[Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) の #gradle チャネルでサポートを求めてください。
>
> **非推奨サイクル**:
>
> - 2.3.0: `kotlin-dsl` プラグインが互換性のない言語またはコンパイラのAPIバージョンで使用されていることを検出する診断を導入する

### AGPバージョン9.0.0以降の `kotlin-android` プラグインを非推奨化

> **課題**: [KT-81199](https://youtrack.jetbrains.com/issue/KT-81199)
>
> **コンポーネント**: Gradle
>
> **非互換変更タイプ**: ソース
>
> **概要**: Kotlin 2.3.0 では、Android Gradleプラグイン (AGP) バージョン9.0.0以降を使用する場合、`org.jetbrains.kotlin.android` プラグインは非推奨となります。
> AGP 9.0.0以降、[AGPはKotlinの組み込みサポートを提供](https://kotl.in/gradle/agp-built-in-kotlin)するため、`kotlin-android` プラグインは不要になりました。
>
> **非推奨サイクル**:
>
> - 2.3.0: `kotlin-android` プラグインがAGPバージョン9.0.0以降で使用され、`android.builtInKotlin` および `android.newDsl=false` の両方のGradleプロパティが `false` に設定されている場合に警告を報告する

### `testApi` 設定を非推奨化

> **課題**: [KT-63285](https://youtrack.jetbrains.com/issue/KT-63285)
>
> **コンポーネント**: Gradle
>
> **非互換変更タイプ**: ソース
>
> **概要**: Kotlin 2.3.0 では `testApi` 設定を非推奨とします。この設定はテスト依存関係とソースを他のモジュールに公開していましたが、Gradleはこの動作をサポートしていません。
>
> **移行オプション**:
> `testApi()` のすべてのインスタンスを `testImplementation()` に置き換え、他のバリアントについても同様に行ってください。例えば、
> `kotlin.sourceSets.commonTest.dependencies.api()` を `kotlin.sourceSets.commonTest.dependencies.implementation()` に置き換えます。
>
> Kotlin/JVMプロジェクトの場合、代わりにGradleの[テストフィクスチャ](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures)の使用を検討してください。
> マルチプラットフォームプロジェクトでのテストフィクスチャのサポートを希望される場合は、[YouTrack](https://youtrack.jetbrains.com/issue/KT-63142) でユースケースを共有してください。
>
> **非推奨サイクル**:
>
> - 2.3.0: 警告を報告する

### `createTestExecutionSpec()` 関数を非推奨化

> **課題**: [KT-75449](https://youtrack.jetbrains.com/issue/KT-75449)
>
> **コンポーネント**: Gradle
>
> **非互換変更タイプ**: ソース
>
> **概要**: Kotlin 2.3.0 では、`KotlinJsTestFramework` インターフェースの `createTestExecutionSpec()` 関数は使用されなくなったため非推奨とします。
>
> **非推奨サイクル**:
>
> - 2.2.20: 警告を報告する
> - 2.3.0: 警告をエラーに昇格する

### `closureTo()`、`createResultSet()`、および `KotlinToolingVersionOrNull()` 関数を削除

> **課題**: [KT-64273](https://youtrack.jetbrains.com/issue/KT-64273)
>
> **コンポーネント**: Gradle
>
> **非互換変更タイプ**: ソース
>
> **概要**: Kotlin 2.3.0 では、`closure` DSLから `closureTo()`、`createResultSet()` 関数が使用されなくなったため削除します。
> さらに、`KotlinToolingVersionOrNull()` 関数も削除されます。代わりに `KotlinToolingVersion()` 関数を使用してください。
>
> **非推奨サイクル**:
>
> - 1.7.20: エラーを報告する
> - 2.3.0: 関数を削除する

### `ExtrasProperty` APIを非推奨化

> **課題**: [KT-74915](https://youtrack.jetbrains.com/issue/KT-74915)
>
> **コンポーネント**: Gradle
>
> **非互換変更タイプ**: ソース
>
> **概要**: Kotlin 2.0.0 から非推奨となっていた `ExtrasProperty` APIは、Kotlin 2.3.0 で内部化されました。
> 代わりにGradleの[`ExtraPropertiesExtension`](https://docs.gradle.org/current/dsl/org.gradle.api.plugins.ExtraPropertiesExtension.html) APIを使用してください。
>
> **非推奨サイクル**:
>
> - 2.0.0: 警告を報告する
> - 2.1.0: 警告をエラーに昇格する
> - 2.3.0: APIを内部化する

### `KotlinCompilation` 内の `HasKotlinDependencies` を非推奨化

> **課題**: [KT-67290](https://youtrack.jetbrains.com/issue/KT-67290)
>
> **コンポーネント**: Gradle
>
> **非互換変更タイプ**: ソース
>
> **概要**: Kotlin 2.3.0 では、[`KotlinCompilation`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-compilation/) インターフェース内の `HasKotlinDependencies` を非推奨とします。
> 依存関係関連のAPIは、代わりに [`KotlinSourceSet`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-source-set/) インターフェースを介して公開されるようになりました。
>
> **非推奨サイクル**:
>
> - 2.3.0: 警告を報告する

### npm および Yarn パッケージマネージャーの内部関数とプロパティを非推奨化

> **課題**: [KT-81009](https://youtrack.jetbrains.com/issue/KT-81009)
>
> **コンポーネント**: Gradle
>
> **非互換変更タイプ**: ソース
>
> **概要**: npm および Yarn パッケージマネージャーに関連する以下の関数とプロパティは非推奨です。
>
> *   `CompositeDependency.dependencyName`, `CompositeDependency.dependencyVersion`, `CompositeDependency.includedBuildDir`.
> *   `KotlinNpmInstallTask.Companion.NAME`.
> *   `LockCopyTask.Companion.STORE_PACKAGE_LOCK_NAME`, `LockCopyTask.Companion.RESTORE_PACKAGE_LOCK_NAME`, `LockCopyTask.Companion.UPGRADE_PACKAGE_LOCK`.
> *   `Npm.npmExec()`.
> *   `NpmProject.require()`, `NpmProject.useTool()`.
> *   `PublicPackageJsonTask.jsIrCompilation`.
> *   `YarnBasics.yarnExec()`.
> *   `YarnPlugin.Companion.STORE_YARN_LOCK_NAME`, `YarnPlugin.Companion.RESTORE_YARN_LOCK_NAME`, `YarnPlugin.Companion.UPGRADE_YARN_LOCK`.
> *   `YarnSetupTask.Companion.NAME`.
>
> **非推奨サイクル**:
>
> - 2.2.0 および 2.2.20: これらの関数またはプロパティを使用すると警告を報告する
> - 2.3.0: 警告をエラーに昇格する

### PhantomJS のサポートを非推奨化

> **課題**: [KT-76019](https://youtrack.jetbrains.com/issue/KT-76019)
>
> **コンポーネント**: Gradle
>
> **非互換変更タイプ**: ソース
>
> **概要**: PhantomJS はもはやメンテナンスされていないため、Kotlin 2.3.0 では `NpmVersions` API の `karmaPhantomjsLauncher` プロパティを非推奨とします。
>
> **非推奨サイクル**:
>
> - 2.3.0: 警告を報告する

### テスト実行またはJavaScriptランタイムを設定するクラスのサブクラス化を禁止

> **課題**: [KT-75869](https://youtrack.jetbrains.com/issue/KT-75869), [KT-81007](https://youtrack.jetbrains.com/issue/KT-81007)
>
> **コンポーネント**: Gradle
>
> **非互換変更タイプ**: ソース
>
> **概要**: Kotlin 2.3.0 では、以下のクラスのサブクラス化を禁止します。
> *   `KotlinTest`
> *   `KotlinNativeTest`
> *   `KotlinJsTest`
> *   `KotlinJsIrTarget`
> *   `KotlinNodeJsIr`
> *   `KotlinD8Ir`
> *   `KotlinKarma`
> *   `KotlinMocha`
> *   `KotlinWebpack`
> *   `TypeScriptValidationTask`
> *   `YarnRootExtension`
>
> これらのクラスはサブクラス化されることを意図していませんでした。サブクラス化のすべてのユースケースは、
> Kotlin GradleプラグインDSLによって提供される設定ブロックでカバーされるはずです。
> これらのタスクの既存のAPIが、テスト実行またはJavaScriptランタイムの設定のニーズを満たさない場合は、[YouTrack](https://youtrack.jetbrains.com/issue/KT-75869) でフィードバックを共有してください。
>
> **非推奨サイクル**:
>
> - 2.2.0: これらのクラスからサブクラスを作成するコードに対して警告を報告する
> - 2.3.0: 警告をエラーに昇格する

### `ExperimentalWasmDsl` アノテーションクラスを非推奨化

> **課題**: [KT-81005](https://youtrack.jetbrains.com/issue/KT-81005)
>
> **コンポーネント**: Gradle
>
> **非互換変更タイプ**: ソース
>
> **概要**: `ExperimentalWasmDsl` アノテーションクラスは、その機能が `kotlin-plugin-annotations` モジュールに移動したため、非推奨となりました。
>
> **非推奨サイクル**:
>
> - 2.0.20: 警告を報告する
> - 2.3.0: 警告をエラーに昇格する

### `ExperimentalDceDsl` アノテーションクラスを非推奨化

> **課題**: [KT-81008](https://youtrack.jetbrains.com/issue/KT-81008)
>
> **コンポーネント**: Gradle
>
> **非互換変更タイプ**: ソース
>
> **概要**: `ExperimentalDceDsl` アノテーションクラスはもはや使用されないため、非推奨となりました。
>
> **非推奨サイクル**:
>
> - 2.2.0: 警告を報告する
> - 2.3.0: 警告をエラーに昇格する

### JavaScriptユーティリティを非推奨化

> **課題**: [KT-81010](https://youtrack.jetbrains.com/issue/KT-81010)
>
> **コンポーネント**: Gradle
>
> **非互換変更タイプ**: ソース
>
> **概要**: 以下の関数とプロパティは内部でのみ使用されるため、非推奨となりました。
> *   `JsIrBinary.generateTs`
> *   `KotlinJsIrLink.mode`
> *   `NodeJsSetupTask.Companion.NAME`
> *   `Appendable.appendConfigsFromDir()`
> *   `ByteArray.toHex()`
> *   `FileHasher.calculateDirHash()`
> *   `String.jsQuoted()`
>
> **非推奨サイクル**:
>
> - 2.2.0: `KotlinJsIrLink.mode` プロパティが使用された場合に警告を報告する
> - 2.2.0: `NodeJsSetupTask.Companion.NAME` プロパティおよび関数が使用された場合に警告を報告する
> - 2.2.20: `JsIrBinary.generateTs` プロパティが使用された場合に警告を報告する
> - 2.3.0: 警告をエラーに昇格する

### 移行されたD8およびBinaryenプロパティを非推奨化

> **課題**: [KT-81006](https://youtrack.jetbrains.com/issue/KT-81006)
>
> **コンポーネント**: Gradle
>
> **非互換変更タイプ**: ソース
>
> **概要**: 以下のプロパティは、`org.jetbrains.kotlin.gradle.targets.js` パッケージから `org.jetbrains.kotlin.gradle.targets.wasm` パッケージに移行されたため、非推奨となりました。
>
> *   `binaryen.BinaryenEnvSpec`
> *   `binaryen.BinaryenExtension`
> *   `binaryen.BinaryenPlugin`
> *   `binaryen.BinaryenRootPlugin`
> *   `BinaryenSetupTask.Companion.NAME`
> *   `d8.D8EnvSpec`
> *   `d8.D8Plugin`
> *   `D8SetupTask.Companion.NAME`
>
> **非推奨サイクル**:
>
> - 2.2.0: 警告を報告する
> - 2.3.0: 警告をエラーに昇格する

### `NodeJsExec` DSL の `create()` 関数を非推奨化

> **課題**: [KT-81004](https://youtrack.jetbrains.com/issue/KT-81004)
>
> **コンポーネント**: Gradle
>
> **非互換変更タイプ**: ソース
>
> **概要**: `NodeJsExec` DSL のコンパニオンオブジェクト内の `create()` 関数は非推奨です。
> 代わりに `register()` 関数を使用してください。
>
> **非推奨サイクル**:
>
> - 2.1.20: 警告を報告する
> - 2.3.0: 警告をエラーに昇格する

### `kotlinOptions` DSL のプロパティを非推奨化

> **課題**: [KT-76720](https://youtrack.jetbrains.com/issue/KT-76720)
>
> **コンポーネント**: Gradle
>
> **非互換変更タイプ**: ソース
>
> **概要**: Kotlin 2.2.0 以降、`kotlinOptions` DSL および関連する `KotlinCompile<KotlinOptions>` タスクインターフェースを介したコンパイラオプションの設定機能は、新しい `compilerOptions` DSL に置き換えられ、非推奨となりました。
> Kotlin 2.3.0 では、`kotlinOptions` インターフェースのすべてのプロパティに対する非推奨サイクルを継続します。
> 移行するには、`compilerOptions` DSL を使用してコンパイラオプションを設定してください。移行に関するガイダンスについては、[`kotlinOptions {}` から `compilerOptions {}` への移行](gradle-compiler-options.md#migrate-from-kotlinoptions-to-compileroptions)を参照してください。
>
> **非推奨サイクル**:
>
> - 2.0.0: `kotlinOptions` DSL について警告を報告する
> - 2.2.0: 警告をエラーに昇格し、`kotlinOptions` のすべてのプロパティを非推奨化する
> - 2.3.0: `kotlinOptions` のすべてのプロパティに対して警告をエラーに昇格する

### `kotlinArtifacts` APIを非推奨化

> **課題**: [KT-77066](https://youtrack.jetbrains.com/issue/KT-77066)
>
> **コンポーネント**: Gradle
>
> **非互換変更タイプ**: ソース
>
> **概要**: 実験的な `kotlinArtifacts` API は非推奨です。Kotlin Gradleプラグインで利用可能な現在のDSLを使用して、[最終的なネイティブバイナリをビルド](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html)してください。
> 移行に十分でない場合は、[このYouTrack課題](https://youtrack.jetbrains.com/issue/KT-74953)にコメントを残してください。
>
> **非推奨サイクル**:
>
> - 2.2.0: `kotlinArtifacts` API が使用された場合に警告を報告する
> - 2.3.0: この警告をエラーに昇格する

### `kotlin.mpp.resourcesResolutionStrategy` Gradleプロパティを削除

> **課題**: [KT-74955](https://youtrack.jetbrains.com/issue/KT-74955)
>
> **コンポーネント**: Gradle
>
> **非互換変更タイプ**: ソース
>
> **概要**: 以前は、`kotlin.mpp.resourcesResolutionStrategy` Gradleプロパティは使用されていなかったため非推奨とされていました。
> Kotlin 2.3.0 では、このGradleプロパティは完全に削除されます。
>
> **非推奨サイクル**:
>
> - 2.2.0: 設定時診断を報告する
> - 2.3.0: Gradleプロパティを削除する

### マルチプラットフォームIDEインポートの古いモードを非推奨化

> **課題**: [KT-61127](https://youtrack.jetbrains.com/issue/KT-61127)
>
> **コンポーネント**: Gradle
>
> **非互換変更タイプ**: ソース
>
> **概要**: Kotlin 2.3.0 より前は、マルチプラットフォームIDEインポートの複数のモードをサポートしていました。現在、古いモードは非推奨となり、利用できるモードは1つだけになりました。
> 以前は、古いモードは `kotlin.mpp.import.enableKgpDependencyResolution=false` Gradleプロパティを使用して有効にされていました。このプロパティを使用すると、非推奨警告がトリガーされるようになりました。
>
> **非推奨サイクル**:
>
> - 2.3.0: `kotlin.mpp.import.enableKgpDependencyResolution=false` Gradleプロパティが使用された場合に警告を報告する

### 正確なコンパイルバックアップを無効にするプロパティを削除

> **課題**: [KT-81038](https://youtrack.jetbrains.com/issue/KT-81038)
>
> **コンポーネント**: Gradle
>
> **非互換変更タイプ**: ソース
>
> **概要**: Kotlin 1.9.0 では、インクリメンタルコンパイルのための実験的な最適化として、正確なコンパイルバックアップが導入されました。
> 成功裏のテスト後、この最適化はKotlin 2.0.0 でデフォルトで有効になりました。Kotlin 2.3.0
> では、この最適化をオプトアウトするための `kotlin.compiler.preciseCompilationResultsBackup` および `kotlin.compiler.keepIncrementalCompilationCachesInMemory` Gradleプロパティを削除します。
>
> **非推奨サイクル**:
>
> - 2.1.20: 警告を報告する
> - 2.3.0: プロパティを削除する

### `CInteropProcess` 内の `destinationDir` を非推奨化

> **課題**: [KT-74910](https://youtrack.jetbrains.com/issue/KT-74910)
>
> **コンポーネント**: Gradle
>
> **非互換変更タイプ**: ソース
>
> **概要**: `CInteropProcess` タスクの `destinationDir` プロパティは非推奨です。
> 代わりに `CInteropProcess.destinationDirectory.set()` 関数を使用してください。
>
> **非推奨サイクル**:
>
> - 2.1.0: `destinationDir` プロパティが使用された場合に警告を報告する
> - 2.2.0: この警告をエラーに昇格する
> - 2.3.0: `destinationDir` プロパティを非表示にする

### `CInteropProcess` 内の `konanVersion` を非推奨化

> **課題**: [KT-74911](https://youtrack.jetbrains.com/issue/KT-74911)
>
> **コンポーネント**: Gradle
>
> **非互換変更タイプ**: ソース
>
> **概要**: `CInteropProcess` タスクの `konanVersion` プロパティは非推奨です。
> 代わりに `CInteropProcess.kotlinNativeVersion` を使用してください。
>
> **非推奨サイクル**:
>
> - 2.1.0: `konanVersion` プロパティが使用された場合に警告を報告する
> - 2.2.0: この警告をエラーに昇格する
> - 2.3.0: `konanVersion` プロパティを非表示にする

### `KotlinCompile.classpathSnapshotProperties` プロパティを削除

> **課題**: [KT-76177](https://youtrack.jetbrains.com/issue/KT-76177)
>
> **コンポーネント**: Gradle
>
> **非互換変更タイプ**: ソース
>
> **概要**: `kotlin.incremental.useClasspathSnapshot` GradleプロパティはKotlin 2.2.0で削除されました。
> Kotlin 2.3.0 では、以下のプロパティも削除されます。
> *   `KotlinCompile.classpathSnapshotProperties.useClasspathSnapshot`
> *   `KotlinCompile.classpathSnapshotProperties.classpath`
>
> **非推奨サイクル**:
>
> - 2.0.20: `kotlin.incremental.useClasspathSnapshot` プロパティを警告付きで非推奨化する
> - 2.2.0: `kotlin.incremental.useClasspathSnapshot` プロパティを削除する
> - 2.3.0: `KotlinCompile.classpathSnapshotProperties.useClasspathSnapshot` および `KotlinCompile.classpathSnapshotProperties.classpath` プロパティを削除する

### `getPluginArtifactForNative()` 関数を非推奨化

> **課題**: [KT-78870](https://youtrack.jetbrains.com/issue/KT-78870)
>
> **コンポーネント**: Gradle
>
> **非互換変更タイプ**: ソース
>
> **概要**: Kotlin 2.2.20 で、[`getPluginArtifactForNative()` 関数が非推奨](whatsnew2220.md#reduced-size-of-kotlin-native-distribution)となりました。
> 代わりに [`getPluginArtifact()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-compiler-plugin-support-plugin/get-plugin-artifact.html) 関数を使用してください。
>
> **非推奨サイクル**:
>
> - 2.2.20: 警告を報告する
> - 2.3.0: 警告をエラーに昇格する

## ビルドツールの削除

### Ant のサポートを削除

> **課題**: [KT-75875](https://youtrack.jetbrains.com/issue/KT-75875)
>
> **コンポーネント**: Ant
>
> **概要**: Kotlin 2.3.0 では、ビルドツールとしてのAntのサポートを削除します。代わりに [Gradle](gradle.md) または [Maven](maven.md) を使用してください。
>
> **非推奨サイクル**:
>
> - 2.2.0: 警告を報告する
> - 2.3.0: サポートを削除する