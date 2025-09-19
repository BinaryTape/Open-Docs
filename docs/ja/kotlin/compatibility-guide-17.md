[//]: # (title: Kotlin 1.7 の互換性ガイド)

_[言語をモダンに保つ](kotlin-evolution-principles.md)_ と _[快適なアップデート](kotlin-evolution-principles.md)_ は、
Kotlin言語設計の基本原則です。前者は、言語の進化を妨げる構成要素は削除されるべきであると述べ、
後者は、コードの移行を可能な限りスムーズにするために、この削除が事前に十分に伝達されるべきであると述べています。

ほとんどの言語変更は、更新チェンジログやコンパイラの警告など、他のチャネルを通じてすでに発表されていますが、
このドキュメントではそれらすべてをまとめ、Kotlin 1.6からKotlin 1.7への移行に関する完全なリファレンスを提供します。

## 基本用語

このドキュメントでは、いくつかの種類の互換性について説明します。

-   _ソース互換性_：ソース非互換な変更により、これまで（エラーや警告なしで）正常にコンパイルされていたコードがコンパイルできなくなること
-   _バイナリ互換性_：2つのバイナリアーティファクトがバイナリ互換であるとは、それらを交換してもロードエラーやリンクエラーが発生しないことを指す
-   _動作互換性_：変更が動作非互換であるとは、同じプログラムが変更適用前後で異なる動作を示すことを指す

これらの定義は純粋なKotlinに対してのみ与えられることに注意してください。他の言語の視点からのKotlinコードの互換性
（例えばJavaからの互換性）は、このドキュメントの範囲外です。

## 言語

<!--
### Title

> **課題**: [KT-NNNNN](https://youtrack.jetbrains.com/issue/KT-NNNNN)
>
> **コンポーネント**: Core language
>
> **非互換変更の種類**: source
>
> **概要**:
>
> **非推奨化サイクル**:
>
> - 1.5.20: warning
> - 1.7.0: report an error
-->

### セーフコールの結果を常にNULL許容にする

> **課題**: [KT-46860](https://youtrack.jetbrains.com/issue/KT-46860)
>
> **コンポーネント**: Core language
>
> **非互換変更の種類**: source
>
> **概要**: Kotlin 1.7 では、セーフコールのレシーバーがNULLを許容しない場合でも、セーフコールの結果の型が常にNULL許容であると見なされます。
>
> **非推奨化サイクル**:
>
> - &lt;1.3: NULLを許容しないレシーバーへの不要なセーフコールに対して警告を報告する
> - 1.6.20: 不要なセーフコールの結果の型が次のバージョンで変更されることを追加で警告する
> - 1.7.0: セーフコールの結果の型をNULL許容に変更する。
>   一時的に1.7以前の動作に戻すには`-XXLanguage:-SafeCallsAreAlwaysNullable`を使用できます。

### スーパークラスの抽象メンバーへのスーパーコールの委譲を禁止する

> **課題**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **コンポーネント**: Core language
>
> **非互換変更の種類**: source
>
> **概要**: Kotlinは、明示的または暗黙的なスーパーコールが、スーパーインターフェースにデフォルト実装がある場合でも、スーパークラスの_抽象_メンバーに委譲されている場合に、コンパイルエラーを報告します。
>
> **非推奨化サイクル**:
>
> - 1.5.20: すべての抽象メンバーをオーバーライドしない非抽象クラスが使用された場合に警告を導入する
> - 1.7.0: スーパーコールが実際にスーパークラスの抽象メンバーにアクセスしている場合にエラーを報告する
> - 1.7.0: `-Xjvm-default=all` または `-Xjvm-default=all-compatibility` 互換性モードが有効になっている場合にエラーを報告する。プログレッシブモードでエラーを報告する。
> - &gt;=1.8.0: すべてのケースでエラーを報告する

### 非公開のプライマリコンストラクタで宣言されたパブリックプロパティを介した非公開型の公開を禁止する

> **課題**: [KT-28078](https://youtrack.jetbrains.com/issue/KT-28078)
>
> **コンポーネント**: Core language
>
> **非互換変更の種類**: source
>
> **概要**: Kotlinは、プライベートなプライマリコンストラクタ内で非公開型を持つパブリックプロパティの宣言を禁止します。別のパッケージからそのようなプロパティにアクセスすると、`IllegalAccessError`が発生する可能性があります。
>
> **非推奨化サイクル**:
>
> - 1.3.20: 非公開型を持ち、非公開コンストラクタで宣言されたパブリックプロパティに対して警告を報告する
> - 1.6.20: この警告をプログレッシブモードでエラーに昇格させる
> - 1.7.0: この警告をエラーに昇格させる

### 列挙名で修飾された未初期化の列挙エントリへのアクセスを禁止する

> **課題**: [KT-41124](https://youtrack.jetbrains.com/issue/KT-41124)
>
> **コンポーネント**: Core language
>
> **非互換変更の種類**: source
>
> **概要**: Kotlin 1.7では、列挙のstaticイニシャライザブロックから、列挙名で修飾された未初期化の列挙エントリへのアクセスが禁止されます。
>
> **非推奨化サイクル**:
>
> - 1.7.0: 列挙のstaticイニシャライザブロックから未初期化の列挙エントリにアクセスされた場合にエラーを報告する

### when条件ブランチおよびループ条件における複雑な真偽値式の定数計算を禁止する

> **課題**: [KT-39883](https://youtrack.jetbrains.com/issue/KT-39883)
>
> **コンポーネント**: Core language
>
> **非互換変更の種類**: source
>
> **概要**: Kotlinは、リテラルの`true`および`false`以外の定数真偽値式に基づいて、whenの網羅性や制御フローの仮定を行わなくなります。
>
> **非推奨化サイクル**:
>
> - 1.5.30: `when`ブランチまたはループ条件内の複雑な定数真偽値式に基づいて、`when`の網羅性または制御フローの到達可能性が決定される場合に警告を報告する
> - 1.7.0: この警告をエラーに昇格させる

### 列挙型、sealed型、およびBoolean型のwhenステートメントをデフォルトで網羅的にする

> **課題**: [KT-47709](https://youtrack.jetbrains.com/issue/KT-47709)
>
> **コンポーネント**: Core language
>
> **非互換変更の種類**: source
>
> **概要**: Kotlin 1.7では、列挙型、sealed型、またはBoolean型を対象とする`when`ステートメントが網羅的でない場合にエラーを報告します。
>
> **非推奨化サイクル**:
>
> - 1.6.0: 列挙型、sealed型、またはBoolean型を対象とする`when`ステートメントが網羅的でない場合に警告を導入する（プログレッシブモードではエラー）
> - 1.7.0: この警告をエラーに昇格させる

### when-with-subjectにおける紛らわしい文法を非推奨化する

> **課題**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **コンポーネント**: Core language
>
> **非互換変更の種類**: source
>
> **概要**: Kotlin 1.6では、`when`条件式におけるいくつかの紛らわしい文法構造が非推奨になりました。
>
> **非推奨化サイクル**:
>
> - 1.6.20: 影響を受ける式に対して非推奨警告を導入する
> - 1.8.0: この警告をエラーに昇格させる
> - &gt;= 1.8: いくつかの非推奨の構造を新しい言語機能のために再利用する

### 型のNULL許容性強化の改善

> **課題**: [KT-48623](https://youtrack.jetbrains.com/issue/KT-48623)
>
> **コンポーネント**: Kotlin/JVM
>
> **非互換変更の種類**: source
>
> **概要**: Kotlin 1.7では、Javaコード内の型のNULL許容性アノテーションのロードおよび解釈方法が変更されます。
>
> **非推奨化サイクル**:
>
> - 1.4.30: より厳密な型のNULL許容性がエラーにつながる可能性のあるケースに対して警告を導入する
> - 1.7.0: Java型のNULL許容性をより厳密に推論する。一時的に1.7以前の動作に戻すには`-XXLanguage:-TypeEnhancementImprovementsInStrictMode`を使用できます。

### 異なる数値型間の暗黙的な型変換を防止する

> **課題**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **コンポーネント**: Kotlin/JVM
>
> **非互換変更の種類**: behavioral
>
> **概要**: Kotlinは、セマンティック上はその型へのダウンキャストのみが必要な場合に、数値がプリミティブ数値型に自動的に変換されるのを回避します。
>
> **非推奨化サイクル**:
>
> - < 1.5.30: 影響を受けるすべてのケースで古い動作
> - 1.5.30: 生成されたプロパティデリゲートアクセサにおけるダウンキャスト動作を修正する。一時的に1.5.30修正以前の動作に戻すには`-Xuse-old-backend`を使用できます。
> - &gt;= 1.7.20: 他の影響を受けるケースでのダウンキャスト動作を修正する

### コンパイラオプション `-Xjvm-default` の `enable` および `compatibility` モードを非推奨化する

> **課題**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **コンポーネント**: Kotlin/JVM
>
> **非互換変更の種類**: source
>
> **概要**: Kotlin 1.6.20では、`-Xjvm-default`コンパイラオプションの`enable`および`compatibility`モードの使用について警告します。
>
> **非推奨化サイクル**:
>
> - 1.6.20: `-Xjvm-default`コンパイラオプションの`enable`および`compatibility`モードについて警告を導入する
> - &gt;= 1.8.0: この警告をエラーに昇格させる

### 末尾ラムダを持つ`suspend`という名前の関数への呼び出しを禁止する

> **課題**: [KT-22562](https://youtrack.jetbrains.com/issue/KT-22562)
>
> **コンポーネント**: Core language
>
> **非互換変更の種類**: source
>
> **概要**: Kotlin 1.6では、関数型を単一の引数として末尾ラムダで渡す`suspend`という名前のユーザー関数を呼び出すことができなくなります。
>
> **非推奨化サイクル**:
>
> - 1.3.0: そのような関数呼び出しに対して警告を導入する
> - 1.6.0: この警告をエラーに昇格させる
> - 1.7.0: `{`の前の`suspend`がキーワードとして解析されるように、言語文法に変更を導入する

### 基底クラスが別のモジュールにある場合、基底クラスのプロパティに対するスマートキャストを禁止する

> **課題**: [KT-52629](https://youtrack.jetbrains.com/issue/KT-52629)
>
> **コンポーネント**: Core language
>
> **非互換変更の種類**: source
>
> **概要**: Kotlin 1.7では、スーパークラスが別のモジュールに存在する場合、そのスーパークラスのプロパティに対するスマートキャストが許可されなくなります。
>
> **非推奨化サイクル**:
>
> - 1.6.0: 別のモジュールにあるスーパークラスで宣言されたプロパティに対するスマートキャストについて警告を報告する
> - 1.7.0: この警告をエラーに昇格させる。一時的に1.7以前の動作に戻すには`-XXLanguage:-ProhibitSmartcastsOnPropertyFromAlienBaseClass`を使用できます。

### 型推論時の意味のある制約を無視しない

> **課題**: [KT-52668](https://youtrack.jetbrains.com/issue/KT-52668)
>
> **コンポーネント**: Core language
>
> **非互換変更の種類**: source
>
> **概要**: Kotlin 1.4−1.6では、不適切な最適化により、型推論時の一部の型制約が無視されていました。これにより、健全でないコードが記述可能となり、実行時に`ClassCastException`が発生する可能性がありました。Kotlin 1.7では、これらの制約が考慮されるため、健全でないコードが禁止されます。
>
> **非推奨化サイクル**:
>
> - 1.5.20: すべての型推論制約が考慮された場合に型ミスマッチが発生する式に対して警告を報告する
> - 1.7.0: すべての制約を考慮に入れることで、この警告をエラーに昇格させる。一時的に1.7以前の動作に戻すには`-XXLanguage:-ProperTypeInferenceConstraintsProcessing`を使用できます。

## 標準ライブラリ

### コレクションのminおよびmax関数の戻り値を徐々に非NULL許容に変更する

> **課題**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **コンポーネント**: kotlin-stdlib
>
> **非互換変更の種類**: source
>
> **概要**: Kotlin 1.7では、コレクションの`min`および`max`関数の戻り値の型が非NULL許容に変更されます。
>
> **非推奨化サイクル**:
>
> - 1.4.0: `...OrNull`関数を同義語として導入し、影響を受けるAPIを非推奨にする（詳細は課題を参照）
> - 1.5.0: 影響を受けるAPIの非推奨レベルをエラーに昇格させる
> - 1.6.0: 非推奨関数をパブリックAPIから非表示にする
> - 1.7.0: 影響を受けるAPIを再導入するが、戻り値の型は非NULL許容とする

### 浮動小数点配列関数 `contains`、`indexOf`、`lastIndexOf` を非推奨化する

> **課題**: [KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
>
> **コンポーネント**: kotlin-stdlib
>
> **非互換変更の種類**: source
>
> **概要**: Kotlinは、全順序ではなくIEEE-754順序を使用して値を比較する浮動小数点配列関数`contains`、`indexOf`、`lastIndexOf`を非推奨にします。
>
> **非推奨化サイクル**:
>
> - 1.4.0: 影響を受ける関数を警告付きで非推奨にする
> - 1.6.0: 非推奨レベルをエラーに昇格させる
> - 1.7.0: 非推奨関数をパブリックAPIから非表示にする

### `kotlin.dom` および `kotlin.browser` パッケージからの宣言を `kotlinx.*` に移行する

> **課題**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **コンポーネント**: kotlin-stdlib (JS)
>
> **非互換変更の種類**: source
>
> **概要**: `kotlin.dom`および`kotlin.browser`パッケージからの宣言は、stdlibからの抽出に備えて対応する`kotlinx.*`パッケージに移動されます。
>
> **非推奨化サイクル**:
>
> - 1.4.0: `kotlinx.dom`および`kotlinx.browser`パッケージに代替APIを導入する
> - 1.4.0: `kotlin.dom`および`kotlin.browser`パッケージのAPIを非推奨にし、上記の新しいAPIを代替として提案する
> - 1.6.0: 非推奨レベルをエラーに昇格させる
> - &gt;= 1.8: 非推奨関数をstdlibから削除する
> - &gt;= 1.8: `kotlinx.*`パッケージ内のAPIを別のライブラリに移動する

### 一部のJS専用APIを非推奨化する

> **課題**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **コンポーネント**: kotlin-stdlib (JS)
>
> **非互換変更の種類**: source
>
> **概要**: stdlib内の一部のJS専用関数が削除のために非推奨になりました。これらには、`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`、および比較関数を取る配列の`sort`関数（例: `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`)が含まれます。
>
> **非推奨化サイクル**:
>
> - 1.6.0: 影響を受ける関数を警告付きで非推奨にする
> - 1.8.0: 非推奨レベルをエラーに昇格させる
> - 1.9.0: 非推奨関数をパブリックAPIから削除する

## ツール

### `KotlinGradleSubplugin` クラスの削除

> **課題**: [KT-48831](https://youtrack.jetbrains.com/issue/KT-48831)
>
> **コンポーネント**: Gradle
>
> **非互換変更の種類**: source
>
> **概要**: `KotlinGradleSubplugin` クラスを削除します。代わりに`KotlinCompilerPluginSupportPlugin` クラスを使用してください。
>
> **非推奨化サイクル**:
>
> - 1.6.0: 非推奨レベルをエラーに昇格させる
> - 1.7.0: 非推奨クラスを削除する

### `useIR` コンパイラオプションの削除

> **課題**: [KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **コンポーネント**: Gradle
>
> **非互換変更の種類**: source
>
> **概要**: 非推奨で隠されていた`useIR`コンパイラオプションを削除します。
>
> **非推奨化サイクル**:
>
> - 1.5.0: 非推奨レベルを警告に昇格させる
> - 1.6.0: オプションを非表示にする
> - 1.7.0: 非推奨オプションを削除する

### `kapt.use.worker.api` Gradle プロパティの非推奨化

> **課題**: [KT-48826](https://youtrack.jetbrains.com/issue/KT-48826)
>
> **コンポーネント**: Gradle
>
> **非互換変更の種類**: source
>
> **概要**: kaptをGradle Workers API経由で実行できるようにする`kapt.use.worker.api`プロパティ（デフォルト: true）を非推奨にします。
>
> **非推奨化サイクル**:
>
> - 1.6.20: 非推奨レベルを警告に昇格させる
> - &gt;= 1.8.0: このプロパティを削除する

### `kotlin.experimental.coroutines` Gradle DSLオプションと`kotlin.coroutines` Gradleプロパティの削除

> **課題**: [KT-50494](https://youtrack.jetbrains.com/issue/KT-50494)
>
> **コンポーネント**: Gradle
>
> **非互換変更の種類**: source
>
> **概要**: `kotlin.experimental.coroutines` Gradle DSLオプションと`kotlin.coroutines`プロパティを削除します。
>
> **非推奨化サイクル**:
>
> - 1.6.20: 非推奨レベルを警告に昇格させる
> - 1.7.0: DSLオプション、それを囲む`experimental`ブロック、およびプロパティを削除する

### `useExperimentalAnnotation` コンパイラオプションの非推奨化

> **課題**: [KT-47763](https://youtrack.jetbrains.com/issue/KT-47763)
>
> **コンポーネント**: Gradle
>
> **非互換変更の種類**: source
>
> **概要**: モジュール内のAPIの使用をオプトインするために使用されていた、隠しGradle関数`useExperimentalAnnotation()`を削除します。代わりに`optIn()`関数を使用できます。
>
> **非推奨化サイクル:**
>
> - 1.6.0: 非推奨オプションを非表示にする
> - 1.7.0: 非推奨オプションを削除する

### `kotlin.compiler.execution.strategy` システムプロパティの非推奨化

> **課題**: [KT-51830](https://youtrack.jetbrains.com/issue/KT-51830)
>
> **コンポーネント**: Gradle
>
> **非互換変更の種類**: source
>
> **概要**: コンパイラの実行戦略を選択するために使用されていた`kotlin.compiler.execution.strategy`システムプロパティを非推奨にします。代わりにGradleプロパティ`kotlin.compiler.execution.strategy`またはコンパイルタスクプロパティ`compilerExecutionStrategy`を使用してください。
>
> **非推奨化サイクル:**
>
> - 1.7.0: 非推奨レベルを警告に昇格させる
> - &gt; 1.7.0: プロパティを削除する

### `kotlinOptions.jdkHome` コンパイラオプションの削除

> **課題**: [KT-46541](https://youtrack.jetbrains.com/issue/KT-46541)
>
> **コンポーネント**: Gradle
>
> **非互換変更の種類**: source
>
> **概要**: デフォルトの`JAVA_HOME`の代わりに、指定された場所からカスタムJDKをクラスパスに含めるために使用されていた`kotlinOptions.jdkHome`コンパイラオプションを削除します。代わりに[Javaツールチェーン](gradle-configure-project.md#gradle-java-toolchains-support)を使用してください。
>
> **非推奨化サイクル:**
>
> - 1.5.30: 非推奨レベルを警告に昇格させる
> - &gt; 1.7.0: オプションを削除する

### `noStdlib` コンパイラオプションの削除

> **課題**: [KT-49011](https://youtrack.jetbrains.com/issue/KT-49011)
>
> **コンポーネント**: Gradle
>
> **非互換変更の種類**: source
>
> **概要**: `noStdlib`コンパイラオプションを削除します。Gradleプラグインは、Kotlin標準ライブラリが存在するかどうかを制御するために`kotlin.stdlib.default.dependency=true`プロパティを使用します。
>
> **非推奨化サイクル**:
>
> - 1.5.0: 非推奨レベルを警告に昇格させる
> - 1.7.0: オプションを削除する

### `kotlin2js` および `kotlin-dce-plugin` プラグインの削除

> **課題**: [KT-48276](https://youtrack.jetbrains.com/issue/KT-48276)
>
> **コンポーネント**: Gradle
>
> **非互換変更の種類**: source
>
> **概要**: `kotlin2js` および `kotlin-dce-plugin` プラグインを削除します。`kotlin2js`の代わりに、新しい`org.jetbrains.kotlin.js`プラグインを使用してください。デッドコード削除（DCE）は、Kotlin/JS Gradleプラグインが適切に設定されている場合に機能します。
>
> **非推奨化サイクル**:
>
> - 1.4.0: 非推奨レベルを警告に昇格させる
> - 1.7.0: プラグインを削除する

### コンパイルタスクの変更点

> **課題**: [KT-32805](https://youtrack.jetbrains.com/issue/KT-32805)
>
> **コンポーネント**: Gradle
>
> **非互換変更の種類**: source
>
> **概要**: Kotlinのコンパイルタスクは、Gradleの`AbstractCompile`タスクを継承しなくなったため、Kotlinユーザーのスクリプトでは`sourceCompatibility`および`targetCompatibility`入力が利用できなくなります。`SourceTask.stableSources`入力は利用できなくなりました。`sourceFilesExtensions`入力は削除されました。非推奨の`Gradle destinationDir: File`出力は`destinationDirectory: DirectoryProperty`出力に置き換えられました。`KotlinCompile`タスクの`classpath`プロパティは非推奨です。
>
> **非推奨化サイクル**:
>
> - 1.7.0: 入力は利用できなくなり、出力は置き換えられ、`classpath`プロパティは非推奨となる