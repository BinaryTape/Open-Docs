---
title: "Kotlin 1.7 の互換性ガイド"
---
_[Keeping the Language Modern](kotlin-evolution-principles)_ と _[Comfortable Updates](kotlin-evolution-principles)_ は、Kotlin言語設計における基本原則です。前者は、言語の進化を妨げる構造は削除されるべきであるとし、後者は、コードの移行を可能な限りスムーズにするために、この削除は事前に十分に周知されるべきであるとしています。

ほとんどの言語変更は、アップデートの変更履歴やコンパイラの警告など、他のチャネルを通じてすでに発表されていますが、このドキュメントではそれらすべてをまとめて、Kotlin 1.6からKotlin 1.7への移行のための完全なリファレンスを提供します。

## 基本的な用語

このドキュメントでは、いくつかの種類の互換性について説明します。

- _source_（ソース）：ソース互換性のない変更とは、エラーや警告なしに正常にコンパイルされていたコードが、コンパイルできなくなる変更のことです。
- _binary_（バイナリ）：2つのバイナリ成果物を互換性があると言うのは、それらを交換してもロードまたはリンケージのエラーが発生しない場合です。
- _behavioral_（動作）：動作互換性のない変更とは、変更を適用する前と後で、同じプログラムが異なる動作を示す場合を指します。

これらの定義は、純粋な Kotlin に対してのみ与えられていることに注意してください。Kotlin コードの他の言語からの互換性
（たとえば、Java からの）は、このドキュメントの範囲外です。

## 言語

<!--
### Title

> **Issue**: [KT-NNNNN](https://youtrack.jetbrains.com/issue/KT-NNNNN)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**:
>
> **Deprecation cycle**:
>
> - 1.5.20: warning
> - 1.7.0: report an error
-->

### safe call（セーフコール）の結果を常にnullableにする

> **Issue**: [KT-46860](https://youtrack.jetbrains.com/issue/KT-46860)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.7では、safe call（セーフコール）の結果の型は、safe call（セーフコール）のreceiver（レシーバ）がnon-nullable（非null）であっても、常にnullable（null許容）とみなされます。
>
> **Deprecation cycle**:
>
> - &lt;1.3: non-nullable（非null）のreceiver（レシーバ）に対する不要なsafe call（セーフコール）について警告を表示します
> - 1.6.20: 不要なsafe call（セーフコール）の結果の型が次のバージョンで変更されることを追加で警告します
> - 1.7.0: safe call（セーフコール）の結果の型をnullable（null許容）に変更します。
> `-XXLanguage:-SafeCallsAreAlwaysNullable` を使用すると、一時的に1.7より前の動作に戻すことができます。

### abstract（抽象）superclass（スーパークラス）メンバーへのsuper call（スーパーコール）の委譲を禁止する

> **Issues**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **Component**: Core language
>
> **Incompatible change type**: source
> 
> **Short summary**: 明示的または暗黙的なsuper call（スーパーコール）がsuperclass（スーパークラス）の_abstract_（抽象）メンバーに委譲される場合、たとえsuper interface（スーパーインターフェース）にデフォルトの実装があったとしても、Kotlinはコンパイルエラーを報告します。
>
> **Deprecation cycle**:
>
> - 1.5.20: すべてのabstract（抽象）メンバーをオーバーライドしないnon-abstract（非抽象）クラスが使用された場合に警告を導入します
> - 1.7.0: super call（スーパーコール）が、実際にはsuperclass（スーパークラス）からのabstract（抽象）メンバーにアクセスする場合、エラーを報告します
> - 1.7.0: `-Xjvm-default=all` または `-Xjvm-default=all-compatibility` 互換モードが有効になっている場合、エラーを報告します。
> progressive mode（プログレッシブモード）でエラーを報告します
> - &gt;=1.8.0: すべての場合にエラーを報告します

### non-public（非公開）のprimary constructor（プライマリコンストラクタ）で宣言されたpublic（公開）プロパティを通じてnon-public（非公開）の型を公開することを禁止する

> **Issue**: [KT-28078](https://youtrack.jetbrains.com/issue/KT-28078)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin は、private（プライベート）なprimary constructor（プライマリコンストラクタ）でnon-public（非公開）の型を持つpublic（公開）プロパティを宣言することを禁止します。
> 別のパッケージからそのようなプロパティにアクセスすると、`IllegalAccessError` が発生する可能性があります。
>
> **Deprecation cycle**:
>
> - 1.3.20: non-public（非公開）の型を持ち、non-public（非公開）のconstructor（コンストラクタ）で宣言されているpublic（公開）プロパティについて警告を報告します
> - 1.6.20: この警告をprogressive mode（プログレッシブモード）でエラーに引き上げます
> - 1.7.0: この警告をエラーに引き上げます

### enum（列挙型）名で修飾された初期化されていないenum entries（列挙型エントリ）へのアクセスを禁止する

> **Issue**: [KT-41124](https://youtrack.jetbrains.com/issue/KT-41124)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.7では、これらのentries（エントリ）がenum（列挙型）名で修飾されている場合、enum（列挙型）のstatic initializer block（静的イニシャライザブロック）から初期化されていないenum entries（列挙型エントリ）へのアクセスを禁止します
>
> **Deprecation cycle**:
>
> - 1.7.0: 初期化されていないenum entries（列挙型エントリ）がenum（列挙型）のstatic initializer block（静的イニシャライザブロック）からアクセスされた場合にエラーを報告します

### when条件分岐とloop（ループ）の条件における複雑なboolean expression（ブール式）の定数値を計算することを禁止する

> **Issue**: [KT-39883](https://youtrack.jetbrains.com/issue/KT-39883)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin は、リテラル `true` および `false` 以外の定数boolean expression（ブール式）に基づいて、exhaustiveness（網羅性）とcontrol flow（制御フロー）の仮定を行わなくなります。
>
> **Deprecation cycle**:
>
> - 1.5.30: `when`のbranch（分岐）またはloop（ループ）の条件における複雑な定数boolean expression（ブール式）に基づいて、`when`のexhaustiveness（網羅性）またはcontrol flow（制御フロー）の到達可能性が決定される場合に警告を報告します
> - 1.7.0: この警告をエラーに引き上げます

### enum（列挙型）、sealed（シールド）型、およびBoolean（ブール）型のsubject（サブジェクト）を持つwhenステートメントをデフォルトでexhaustive（網羅的）にする

> **Issue**: [KT-47709](https://youtrack.jetbrains.com/issue/KT-47709)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.7では、enum（列挙型）、sealed（シールド）型、またはBoolean（ブール）型のsubject（サブジェクト）を持つ`when`ステートメントがnon-exhaustive（非網羅的）であるというエラーを報告します
>
> **Deprecation cycle**:
>
> - 1.6.0: enum（列挙型）、sealed（シールド）型、またはBoolean（ブール）型のsubject（サブジェクト）を持つ`when`ステートメントがnon-exhaustive（非網羅的）である場合に警告を導入します（progressive mode（プログレッシブモード）ではエラー）
> - 1.7.0: この警告をエラーに引き上げます

### when-with-subjectの紛らわしい文法を非推奨にする

> **Issue**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6では、`when`条件式におけるいくつかの紛らわしい文法構造が非推奨になりました。
>
> **Deprecation cycle**:
>
> - 1.6.20: 影響を受ける式に非推奨の警告を導入します
> - 1.8.0: この警告をエラーに引き上げます
> - &gt;= 1.8: いくつかの非推奨の構造を新しい言語機能のために再利用します

### 型nullability（Null許容性）の強化の改善

> **Issue**: [KT-48623](https://youtrack.jetbrains.com/issue/KT-48623)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.7では、Java コードの型nullability（Null許容性）annotation（アノテーション）のロードおよび解釈方法が変更されます。
>
> **Deprecation cycle**:
>
> - 1.4.30: より正確な型nullability（Null許容性）がエラーにつながる可能性がある場合に警告を導入します
> - 1.7.0: Java型のより正確なnullability（Null許容性）を推論します。
> `-XXLanguage:-TypeEnhancementImprovementsInStrictMode` を使用すると、一時的に1.7より前の動作に戻すことができます。

### 異なる数値型間の暗黙的な型変換を禁止する

> **Issue**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin は、セマンティクス的にその型へのdowncast（ダウンキャスト）のみが必要な場合に、数値が自動的にプリミティブな数値型に変換されるのを回避します。
>
> **Deprecation cycle**:
>
> - < 1.5.30: 影響を受けるすべての場合における古い動作
> - 1.5.30: 生成されたプロパティdelegate（デリゲート）accessor（アクセッサ）でdowncast（ダウンキャスト）の動作を修正します。
> `-Xuse-old-backend` を使用すると、一時的に1.5.30より前の修正動作に戻すことができます。
> - &gt;= 1.7.20: 影響を受ける他のケースでdowncast（ダウンキャスト）の動作を修正します

### コンパイラオプション-Xjvm-defaultのenable（有効化）モードとcompatibility（互換性）モードを非推奨にする

> **Issue**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6.20 は、`-Xjvm-default` コンパイラオプションの `enable` モードと `compatibility` モードの使用について警告します。
>
> **Deprecation cycle**:
>
> - 1.6.20: `-Xjvm-default` コンパイラオプションの `enable` モードと `compatibility` モードに警告を導入します
> - &gt;= 1.8.0: この警告をエラーに引き上げます

### 末尾のlambda（ラムダ）を持つsuspendという名前の関数への呼び出しを禁止する

> **Issue**: [KT-22562](https://youtrack.jetbrains.com/issue/KT-22562)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 では、functional type（関数型）の単一の引数を末尾のlambda（ラムダ）として渡す `suspend` という名前のユーザー関数の呼び出しは許可されなくなりました。
>
> **Deprecation cycle**:
>
> - 1.3.0: そのような関数の呼び出しに警告を導入します
> - 1.6.0: この警告をエラーに引き上げます
> - 1.7.0: `{` の前の `suspend` がキーワードとして解析されるように言語文法を変更します

### base class（ベースクラス）が別のmodule（モジュール）からのものである場合、base class（ベースクラス）のプロパティに対するsmart cast（スマートキャスト）を禁止する

> **Issue**: [KT-52629](https://youtrack.jetbrains.com/issue/KT-52629)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: そのクラスが別のmodule（モジュール）にある場合、Kotlin 1.7 はsuperclass（スーパークラス）のプロパティに対するsmart cast（スマートキャスト）を許可しません。
>
> **Deprecation cycle**:
>
> - 1.6.0: 別のmodule（モジュール）にあるsuperclass（スーパークラス）で宣言されたプロパティに対するsmart cast（スマートキャスト）について警告を報告します
> - 1.7.0: この警告をエラーに引き上げます。
> `-XXLanguage:-ProhibitSmartcastsOnPropertyFromAlienBaseClass` を使用すると、一時的に1.7より前の動作に戻すことができます。

### 型推論中に意味のあるconstraint（制約）を無視しない

> **Issue**: [KT-52668](https://youtrack.jetbrains.com/issue/KT-52668)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.4〜1.6 では、誤った最適化のために型推論中にいくつかの型constraint（制約）が無視されました。
> それにより、実行時に `ClassCastException` を引き起こす可能性のある不正なコードの記述が許可される可能性がありました。
> Kotlin 1.7 では、これらのconstraint（制約）が考慮されるため、不正なコードは禁止されます
>
> **Deprecation cycle**:
>
> - 1.5.20: すべての型推論constraint（制約）が考慮された場合に型不一致が発生する式について警告を報告します
> - 1.7.0: すべてのconstraint（制約）を考慮に入れ、この警告をエラーに引き上げます。
> `-XXLanguage:-ProperTypeInferenceConstraintsProcessing` を使用すると、一時的に1.7より前の動作に戻すことができます。

## 標準ライブラリ

### collection（コレクション）のmin関数とmax関数の戻り値を段階的にnon-nullable（非null許容）に変更する

> **Issue**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: collection（コレクション）の `min` 関数と `max` 関数の戻り値の型は、Kotlin 1.7 で non-nullable（非null許容）に変更されます
>
> **Deprecation cycle**:
>
> - 1.4.0: `...OrNull` 関数を同義語として導入し、影響を受ける API を非推奨にします（詳細については、課題を参照してください）
> - 1.5.0: 影響を受ける API の非推奨レベルをエラーに引き上げます
> - 1.6.0: 非推奨の関数をpublic API（公開API）から隠します
> - 1.7.0: 影響を受ける API を再導入しますが、戻り値の型はnon-nullable（非null許容）になります

### floating-point array（浮動小数点配列）関数：contains、indexOf、lastIndexOfを非推奨にする

> **Issue**: [KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin は、合計順序の代わりに IEEE-754 順序を使用して値を比較するfloating-point array（浮動小数点配列）関数 `contains`、`indexOf`、`lastIndexOf` を非推奨にします
>
> **Deprecation cycle**:
>
> - 1.4.0: 警告付きで影響を受ける関数を非推奨にします
> - 1.6.0: 非推奨レベルをエラーに引き上げます
> - 1.7.0: 非推奨の関数をpublic API（公開API）から隠します

### kotlin.dom パッケージおよび kotlin.browser パッケージから kotlinx.* へのdeclaration（宣言）の移行

> **Issue**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: `kotlin.dom` パッケージおよび `kotlin.browser` パッケージからのdeclaration（宣言）は、stdlib から抽出する準備として、対応する `kotlinx.*` パッケージに移動されます。
>
> **Deprecation cycle**:
>
> - 1.4.0: `kotlinx.dom` パッケージおよび `kotlinx.browser` パッケージに代替 API を導入します
> - 1.4.0: `kotlin.dom` パッケージおよび `kotlin.browser` パッケージの API を非推奨にし、上記の新しい API を代替として提案します
> - 1.6.0: 非推奨レベルをエラーに引き上げます
> - &gt;= 1.8: 非推奨の関数を stdlib から削除します
> - &gt;= 1.8: kotlinx.* パッケージの API を個別のライブラリに移動します

### 一部の JS 専用 API を非推奨にする

> **Issue**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: stdlib の多数の JS 専用関数は、削除のために非推奨になりました。それらには、`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`、および比較関数を取る配列の `sort` 関数（たとえば、`Array<out T>.sort(comparison: (a: T, b: T) `->` Int)`）が含まれます。
>
> **Deprecation cycle**:
>
> - 1.6.0: 警告付きで影響を受ける関数を非推奨にします
> - 1.8.0: 非推奨レベルをエラーに引き上げます
> - 1.9.0: 非推奨の関数をpublic API（公開API）から削除します

## ツール

### KotlinGradleSubplugin クラスを削除する

> **Issue**: [KT-48831](https://youtrack.jetbrains.com/issue/KT-48831)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `KotlinGradleSubplugin` クラスを削除します。代わりに `KotlinCompilerPluginSupportPlugin` クラスを使用してください
>
> **Deprecation cycle**:
>
> - 1.6.0: 非推奨レベルをエラーに引き上げます
> - 1.7.0: 非推奨のクラスを削除します

### useIR コンパイラオプションを削除する

> **Issue**: [KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 非推奨で非表示の `useIR` コンパイラオプションを削除します
>
> **Deprecation cycle**:
>
> - 1.5.0: 非推奨レベルを警告に引き上げます
> - 1.6.0: オプションを非表示にします
> - 1.7.0: 非推奨のオプションを削除します

### kapt.use.worker.api Gradle プロパティを非推奨にする

> **Issue**: [KT-48826](https://youtrack.jetbrains.com/issue/KT-48826)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: Gradle Workers API を介して kapt の実行を許可する `kapt.use.worker.api` プロパティを非推奨にします（デフォルト: true）
>
> **Deprecation cycle**:
>
> - 1.6.20: 非推奨レベルを警告に引き上げます
> - &gt;= 1.8.0: このプロパティを削除します

### kotlin.experimental.coroutines Gradle DSL オプションおよび kotlin.coroutines Gradle プロパティを削除する

> **Issue**: [KT-50494](https://youtrack.jetbrains.com/issue/KT-50494)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `kotlin.experimental.coroutines` Gradle DSL オプションおよび `kotlin.coroutines` プロパティを削除します
>
> **Deprecation cycle**:
>
> - 1.6.20: 非推奨レベルを警告に引き上げます
> - 1.7.0: DSL オプション、それを囲む `experimental` ブロック、およびプロパティを削除します

### useExperimentalAnnotation コンパイラオプションを非推奨にする

> **Issue**: [KT-47763](https://youtrack.jetbrains.com/issue/KT-47763)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: module（モジュール）で API の使用を選択するために使用される、非表示の `useExperimentalAnnotation()` Gradle 関数を削除します。
> 代わりに `optIn()` 関数を使用できます
> 
> **Deprecation cycle:**
> 
> - 1.6.0: 非推奨オプションを非表示にします
> - 1.7.0: 非推奨のオプションを削除します

### kotlin.compiler.execution.strategy システムプロパティを非推奨にする

> **Issue**: [KT-51830](https://youtrack.jetbrains.com/issue/KT-51830)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: コンパイラの実行戦略を選択するために使用される `kotlin.compiler.execution.strategy` システムプロパティを非推奨にします。
> 代わりに、Gradle プロパティ `kotlin.compiler.execution.strategy` またはコンパイルタスクプロパティ `compilerExecutionStrategy` を使用してください
>
> **Deprecation cycle:**
>
> - 1.7.0: 非推奨レベルを警告に引き上げます
> - &gt; 1.7.0: プロパティを削除します

### kotlinOptions.jdkHome コンパイラオプションを削除する

> **Issue**: [KT-46541](https://youtrack.jetbrains.com/issue/KT-46541)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: デフォルトの `JAVA_HOME` の代わりに、指定された場所からカスタム JDK をclasspath（クラスパス）に含めるために使用される `kotlinOptions.jdkHome` コンパイラオプションを削除します。代わりに [Java toolchains](gradle-configure-project#gradle-java-toolchains-support) を使用してください
>
> **Deprecation cycle:**
>
> - 1.5.30: 非推奨レベルを警告に引き上げます
> - &gt; 1.7.0: オプションを削除します

### noStdlib コンパイラオプションを削除する

> **Issue**: [KT-49011](https://youtrack.jetbrains.com/issue/KT-49011)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `noStdlib` コンパイラオプションを削除します。Gradle プラグインは、Kotlin 標準ライブラリが存在するかどうかを制御するために、`kotlin.stdlib.default.dependency=true` プロパティを使用します。
>
> **Deprecation cycle:**
>
> - 1.5.0: 非推奨レベルを警告に引き上げます
> - 1.7.0: オプションを削除します

### kotlin2js プラグインおよび kotlin-dce-plugin プラグインを削除する

> **Issue**: [KT-48276](https://youtrack.jetbrains.com/issue/KT-48276)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `kotlin2js` プラグインおよび `kotlin-dce-plugin` プラグインを削除します。`kotlin2js` の代わりに、新しい `org.jetbrains.kotlin.js` プラグインを使用します。
> Dead code elimination (DCE)（未使用コード削除）は、Kotlin/JS Gradle プラグインが[適切に構成されている](http://javascript-dce)場合に機能します

>
> **Deprecation cycle:**
>
> - 1.4.0: 非推奨レベルを警告に引き上げます
> - 1.7.0: プラグインを削除します

### コンパイルタスクの変更

> **Issue**: [KT-32805](https://youtrack.jetbrains.com/issue/KT-32805)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin コンパイルタスクは Gradle `AbstractCompile` タスクを継承しなくなったため、
> `sourceCompatibility` 入力と `targetCompatibility` 入力は Kotlin ユーザーのスクリプトでは使用できなくなりました。
> `SourceTask.stableSources` 入力は使用できなくなりました。`sourceFilesExtensions` 入力が削除されました。
> 非推奨の `Gradle destinationDir: File` 出力は `destinationDirectory: DirectoryProperty` 出力に置き換えられました。
> `KotlinCompile` タスクの `classpath` プロパティは非推奨になりました。
>
> **Deprecation cycle:**
>
> - 1.7.0: 入力は使用できなくなり、出力は置き換えられ、`classpath` プロパティは非推奨になります