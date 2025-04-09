---
title: "Kotlin 1.6の互換性ガイド"
---
_[言語の現代化の維持](kotlin-evolution-principles)_と_[快適なアップデート](kotlin-evolution-principles)_は、Kotlin言語設計における基本原則です。前者は、言語の進化を妨げる構造は削除されるべきであるとし、後者は、コードの移行を可能な限りスムーズにするために、この削除について事前に十分に周知されるべきであるとしています。

ほとんどの言語変更は、アップデートの変更履歴やコンパイラの警告など、他のチャネルを通じてすでに発表されていますが、このドキュメントではそれらすべてをまとめて、Kotlin 1.5からKotlin 1.6への移行に関する完全なリファレンスを提供します。

## 基本用語

このドキュメントでは、いくつかの種類の互換性について説明します。

- _source_（ソース）：ソース非互換の変更は、エラーや警告なしで正常にコンパイルされていたコードが、コンパイルできなくなるようにします。
- _binary_（バイナリ）：2つのバイナリアーティファクトを相互に交換しても、ロードまたはリンケージエラーが発生しない場合、それらはバイナリ互換であると言います。
- _behavioral_（動作）：変更を適用する前と後で、同じプログラムが異なる動作を示す場合、その変更は動作非互換であると言います。

これらの定義は、純粋なKotlinに対してのみ与えられていることに注意してください。他の言語からのKotlinコードの互換性（たとえば、Javaからの互換性）は、このドキュメントの範囲外です。

## 言語

### enum、sealed、およびBooleanのsubjectを持つwhenステートメントをデフォルトで網羅的にする

> **Issue**: [KT-47709](https://youtrack.jetbrains.com/issue/KT-47709)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6では、enum、sealed、またはBooleanのsubjectを持つ`when`ステートメントが網羅的でない場合に警告が表示されます。
>
> **Deprecation cycle**:
>
> - 1.6.0: enum、sealed、またはBooleanのsubjectを持つ`when`ステートメントが網羅的でない場合に警告を表示します（progressive modeではエラー）。
> - 1.7.0: この警告をエラーに昇格させます。

### when-with-subjectにおける紛らわしい文法を非推奨にする

> **Issue**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6では、`when`条件式におけるいくつかの紛らわしい文法構造を非推奨にします。
>
> **Deprecation cycle**:
>
> - 1.6.20: 影響を受ける式に非推奨警告を表示します。
> - 1.8.0: この警告をエラーに昇格させます。
> - &gt;= 1.8: いくつかの非推奨の構造を新しい言語機能のために再利用します。

### コンパニオンオブジェクトおよびネストされたオブジェクトのsuperコンストラクタ呼び出しにおけるクラスメンバへのアクセスを禁止する

> **Issue**: [KT-25289](https://youtrack.jetbrains.com/issue/KT-25289)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6では、コンパニオンオブジェクトおよび通常のオブジェクトのsuperコンストラクタ呼び出しの引数が、そのような引数のレシーバが包含する宣言を参照する場合、エラーを報告します。
>
> **Deprecation cycle**:
>
> - 1.5.20: 問題のある引数に警告を表示します。
> - 1.6.0: この警告をエラーに昇格させます。
>  `-XXLanguage:-ProhibitSelfCallsInNestedObjects`を使用すると、一時的に1.6より前の動作に戻すことができます。

### 型nullabilityの強化の改善

> **Issue**: [KT-48623](https://youtrack.jetbrains.com/issue/KT-48623)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.7では、Javaコードにおける型nullabilityのアノテーションのロードおよび解釈方法を変更します。
>
> **Deprecation cycle**:
>
> - 1.4.30: より正確な型nullabilityがエラーにつながる可能性がある場合に警告を表示します。
> - 1.7.0: Java型のより正確なnullabilityを推論します。
>   `-XXLanguage:-TypeEnhancementImprovementsInStrictMode`を使用すると、一時的に1.7より前の動作に戻すことができます。

### 異なる数値型間の暗黙的な型変換を禁止する

> **Issue**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlinは、セマンティクス的にその型へのダウンキャストのみが必要な場合に、数値が自動的にプリミティブ数値型に変換されるのを回避します。
>
> **Deprecation cycle**:
>
> - < 1.5.30: 影響を受けるすべてのケースにおける古い動作。
> - 1.5.30: 生成されたプロパティデリゲートアクセサにおけるダウンキャストの動作を修正します。
>   `-Xuse-old-backend`を使用すると、一時的に1.5.30より前の修正前の動作に戻すことができます。
> - &gt;= 1.6.20: 他の影響を受けるケースにおけるダウンキャストの動作を修正します。

### コンテナアノテーションがJLSに違反するrepeatableアノテーションクラスの宣言を禁止する

> **Issue**: [KT-47928](https://youtrack.jetbrains.com/issue/KT-47928)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6では、repeatableアノテーションのコンテナアノテーションが、[JLS 9.6.3](https://docs.oracle.com/javase/specs/jls/se16/html/jls-9.html#jls-9.6.3)と同じ要件（配列型のvalueメソッド、retention、およびtarget）を満たしていることを確認します。
>
> **Deprecation cycle**:
>
> - 1.5.30: JLS要件に違反するrepeatableコンテナアノテーションの宣言に警告を表示します（progressive modeではエラー）。
> - 1.6.0: この警告をエラーに昇格させます。
>   `-XXLanguage:-RepeatableAnnotationContainerConstraints`を使用すると、一時的にエラー報告を無効にできます。

### repeatableアノテーションクラスにおけるContainerという名前のネストされたクラスの宣言を禁止する

> **Issue**: [KT-47971](https://youtrack.jetbrains.com/issue/KT-47971)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6では、Kotlinで宣言されたrepeatableアノテーションが、定義済みの名前`Container`を持つネストされたクラスを持っていないことを確認します。
>
> **Deprecation cycle**:
>
> - 1.5.30: Kotlin-repeatableアノテーションクラスにおける`Container`という名前のネストされたクラスに警告を表示します（progressive modeではエラー）。
> - 1.6.0: この警告をエラーに昇格させます。
>   `-XXLanguage:-RepeatableAnnotationContainerConstraints`を使用すると、一時的にエラー報告を無効にできます。

### インターフェースプロパティをオーバーライドするプライマリコンストラクタのプロパティにおける@JvmFieldを禁止する

> **Issue**: [KT-32753](https://youtrack.jetbrains.com/issue/KT-32753)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6では、インターフェースプロパティをオーバーライドするプライマリコンストラクタで宣言されたプロパティに`@JvmField`アノテーションを付けることを禁止します。
>
> **Deprecation cycle**:
>
> - 1.5.20: プライマリコンストラクタにおけるそのようなプロパティの`@JvmField`アノテーションに警告を表示します。
> - 1.6.0: この警告をエラーに昇格させます。
>   `-XXLanguage:-ProhibitJvmFieldOnOverrideFromInterfaceInPrimaryConstructor`を使用すると、一時的にエラー報告を無効にできます。

### コンパイラオプション-Xjvm-defaultのenableモードとcompatibilityモードを非推奨にする

> **Issue**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6.20では、`-Xjvm-default`コンパイラオプションの`enable`モードと`compatibility`モードの使用について警告が表示されます。
>
> **Deprecation cycle**:
>
> - 1.6.20: `-Xjvm-default`コンパイラオプションの`enable`モードと`compatibility`モードに警告を表示します。
> - &gt;= 1.8.0: この警告をエラーに昇格させます。

### public-abiインライン関数からのsuper呼び出しを禁止する

> **Issue**: [KT-45379](https://youtrack.jetbrains.com/issue/KT-45379)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6では、publicまたはprotectedのインライン関数およびプロパティから`super`修飾子を持つ関数を呼び出すことを禁止します。
>
> **Deprecation cycle**:
>
> - 1.5.0: publicまたはprotectedのインライン関数またはプロパティアクセサからのsuper呼び出しに警告を表示します。
> - 1.6.0: この警告をエラーに昇格させます。
>   `-XXLanguage:-ProhibitSuperCallsFromPublicInline`を使用すると、一時的にエラー報告を無効にできます。

### publicインライン関数からのprotectedコンストラクタ呼び出しを禁止する

> **Issue**: [KT-48860](https://youtrack.jetbrains.com/issue/KT-48860)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6では、publicまたはprotectedのインライン関数およびプロパティからprotectedコンストラクタを呼び出すことを禁止します。
>
> **Deprecation cycle**:
>
> - 1.4.30: publicまたはprotectedのインライン関数またはプロパティアクセサからのprotectedコンストラクタ呼び出しに警告を表示します。
> - 1.6.0: この警告をエラーに昇格させます。
>   `-XXLanguage:-ProhibitProtectedConstructorCallFromPublicInline`を使用すると、一時的にエラー報告を無効にできます。

### private-in-file型からのprivateネスト型のエクスポーズを禁止する

> **Issue**: [KT-20094](https://youtrack.jetbrains.com/issue/KT-20094)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6では、private-in-file型からのprivateネスト型および内部クラスのエクスポーズを禁止します。
>
> **Deprecation cycle**:
>
> - 1.5.0: private-in-file型からエクスポーズされたprivate型に警告を表示します。
> - 1.6.0: この警告をエラーに昇格させます。
>   `-XXLanguage:-PrivateInFileEffectiveVisibility`を使用すると、一時的にエラー報告を無効にできます。

### アノテーションターゲットは、型のアノテーションについて、いくつかのケースで分析されない

> **Issue**: [KT-28449](https://youtrack.jetbrains.com/issue/KT-28449)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6では、型に適用できないはずの型のアノテーションを許可しなくなります。
>
> **Deprecation cycle**:
>
> - 1.5.20: progressive modeでエラーを表示します。
> - 1.6.0: エラーを表示します。
>   `-XXLanguage:-ProperCheckAnnotationsTargetInTypeUsePositions`を使用すると、一時的にエラー報告を無効にできます。

### 末尾のラムダを持つsuspendという名前の関数への呼び出しを禁止する

> **Issue**: [KT-22562](https://youtrack.jetbrains.com/issue/KT-22562)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6では、関数型型の単一の引数を末尾のラムダとして渡す、`suspend`という名前の関数の呼び出しを許可しなくなります。
>
> **Deprecation cycle**:
>
> - 1.3.0: そのような関数呼び出しに警告を表示します。
> - 1.6.0: この警告をエラーに昇格させます。
> - &gt;= 1.7.0: 言語文法を変更して、`{`の前の`suspend`がキーワードとして解析されるようにします。

## 標準ライブラリ

### minus/removeAll/retainAllにおける脆いcontains最適化を削除する

> **Issue**: [KT-45438](https://youtrack.jetbrains.com/issue/KT-45438)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 1.6では、collection/iterable/array/sequenceから複数の要素を削除する関数および演算子の引数に対して、setへの変換を実行しなくなります。
>
> **Deprecation cycle**:
>
> - < 1.6: 古い動作：引数は場合によってはsetに変換されます。
> - 1.6.0: 関数の引数がcollectionの場合、`Set`に変換されなくなります。collectionでない場合は、代わりに`List`に変換される可能性があります。
> 古い動作は、システムプロパティ`kotlin.collections.convert_arg_to_set_in_removeAll=true`を設定することで、JVM上で一時的に元に戻すことができます。
> - &gt;= 1.7: 上記のシステムプロパティは効果がなくなります。

### Random.nextLongにおける値生成アルゴリズムを変更する

> **Issue**: [KT-47304](https://youtrack.jetbrains.com/issue/KT-47304)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 1.6では、指定された範囲外の値を生成しないように、`Random.nextLong`関数の値生成アルゴリズムを変更します。
>
> **Deprecation cycle**:
>
> - 1.6.0: 動作はすぐに修正されます。

### collectionのmin関数とmax関数の戻り型を徐々にnon-nullableに変更する

> **Issue**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: collectionの`min`関数と`max`関数の戻り型は、Kotlin 1.7でnon-nullableに変更されます。
>
> **Deprecation cycle**:
>
> - 1.4.0: `...OrNull`関数を同義語として導入し、影響を受けるAPIを非推奨にします（詳細はissueを参照）。
> - 1.5.0: 影響を受けるAPIの非推奨レベルをエラーに昇格させます。
> - 1.6.0: 非推奨の関数をpublic APIから隠します。
> - &gt;= 1.7: 影響を受けるAPIを再導入しますが、戻り型はnon-nullableです。

### 浮動小数点配列関数（contains、indexOf、lastIndexOf）を非推奨にする

> **Issue**: [KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlinは、合計順序ではなくIEEE-754順序を使用して値を比較する浮動小数点配列関数`contains`、`indexOf`、`lastIndexOf`を非推奨にします。
>
> **Deprecation cycle**:
>
> - 1.4.0: 影響を受ける関数を警告付きで非推奨にします。
> - 1.6.0: 非推奨レベルをエラーに昇格させます。
> - &gt;= 1.7: 非推奨の関数をpublic APIから隠します。

### kotlin.domパッケージおよびkotlin.browserパッケージからkotlinx.*へ宣言を移行する

> **Issue**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: `kotlin.dom`パッケージおよび`kotlin.browser`パッケージからの宣言は、stdlibから抽出する準備として、対応する`kotlinx.*`パッケージに移動されます。
>
> **Deprecation cycle**:
>
> - 1.4.0: `kotlinx.dom`パッケージおよび`kotlinx.browser`パッケージに代替APIを導入します。
> - 1.4.0: `kotlin.dom`パッケージおよび`kotlin.browser`パッケージのAPIを非推奨にし、上記の新しいAPIを代替として提案します。
> - 1.6.0: 非推奨レベルをエラーに昇格させます。
> - &gt;= 1.7: 非推奨の関数をstdlibから削除します。
> - &gt;= 1.7: kotlinx.*パッケージのAPIを個別のライブラリに移動します。

### Kotlin/JSでRegex.replace関数をインライン化しない

> **Issue**: [KT-27738](https://youtrack.jetbrains.com/issue/KT-27738)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: 関数の`transform`パラメータを持つ`Regex.replace`関数は、Kotlin/JSではインライン化されなくなります。
>
> **Deprecation cycle**:
>
> - 1.6.0: 影響を受ける関数から`inline`修飾子を削除します。

### 置換文字列にグループ参照が含まれる場合のJVMとJSにおけるRegex.replace関数の異なる動作

> **Issue**: [KT-28378](https://youtrack.jetbrains.com/issue/KT-28378)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin/JSの関数`Regex.replace`（置換パターン文字列を使用）は、Kotlin/JVMと同じパターンの構文に従います。
>
> **Deprecation cycle**:
>
> - 1.6.0: Kotlin/JS stdlibの`Regex.replace`における置換パターンの処理を変更します。

### JS RegexでUnicode大文字小文字区別を使用する

> **Issue**: [KT-45928](https://youtrack.jetbrains.com/issue/KT-45928)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin/JSの`Regex`クラスは、Unicodeルールに従って文字を検索および比較するために、基盤となるJS正規表現エンジンを呼び出すときに[`unicode`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicode)フラグを使用します。
> これにより、JS環境の特定のバージョン要件が発生し、正規表現パターン文字列内の不要なエスケープのより厳密な検証が行われます。
>
> **Deprecation cycle**:
>
> - 1.5.0: JS `Regex`クラスのほとんどの関数でUnicode大文字小文字区別を有効にします。
> - 1.6.0: `Regex.replaceFirst`関数でUnicode大文字小文字区別を有効にします。

### 一部のJS専用APIを非推奨にする

> **Issue**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: stdlibの多くのJS専用関数は、削除するために非推奨になっています。これらには、`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`、および比較関数を取る配列の`sort`関数（たとえば、`Array<out T>.sort(comparison: (a: T, b: T) `->` Int)`）が含まれます。
>
> **Deprecation cycle**:
>
> - 1.6.0: 影響を受ける関数を警告付きで非推奨にします。
> - 1.7.0: 非推奨レベルをエラーに昇格させます。
> - 1.8.0: 非推奨の関数をpublic APIから削除します。

### Kotlin/JSのクラスのpublic APIから、実装固有および相互運用固有の関数を隠す

> **Issue**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source, binary
>
> **Short summary**: 関数`HashMap.createEntrySet`および`AbstactMutableCollection.toJSON`の可視性をinternalに変更します。
>
> **Deprecation cycle**:
>
> - 1.6.0: 関数をinternalにし、public APIから削除します。

## ツール

### KotlinGradleSubpluginクラスを非推奨にする

> **Issue**: [KT-48830](https://youtrack.jetbrains.com/issue/KT-48830)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: クラス`KotlinGradleSubplugin`は、`KotlinCompilerPluginSupportPlugin`に賛成して非推奨になります。
>
> **Deprecation cycle**:
>
> - 1.6.0: 非推奨レベルをエラーに昇格させます。
> - &gt;= 1.7.0: 非推奨のクラスを削除します。

### kotlin.useFallbackCompilerSearchビルドオプションを削除する

> **Issue**: [KT-46719](https://youtrack.jetbrains.com/issue/KT-46719)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 非推奨の'kotlin.useFallbackCompilerSearch'ビルドオプションを削除します。
>
> **Deprecation cycle**:
>
> - 1.5.0: 非推奨レベルを警告に昇格させます。
> - 1.6.0: 非推奨のオプションを削除します。

### いくつかのコンパイラオプションを削除する

> **Issue**: [KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 非推奨の`noReflect`および`includeRuntime`コンパイラオプションを削除します。
>
> **Deprecation cycle**:
>
> - 1.5.0: 非推奨レベルをエラーに昇格させます。
> - 1.6.0: 非推奨のオプションを削除します。

### useIRコンパイラオプションを非推奨にする

> **Issue**: [KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 非推奨の`useIR`コンパイラオプションを隠します。
>
> **Deprecation cycle**:
>
> - 1.5.0: 非推奨レベルを警告に昇格させます。
> - 1.6.0: オプションを隠します。
> - &gt;= 1.7.0: 非推奨のオプションを削除します。

### kapt.use.worker.api Gradleプロパティを非推奨にする

> **Issue**: [KT-48826](https://youtrack.jetbrains.com/issue/KT-48826)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: Gradle Workers API経由でkaptを実行できるようにする`kapt.use.worker.api`プロパティを非推奨にします（デフォルト：true）。
>
> **Deprecation cycle**:
>
> - 1.6.20: 非推奨レベルを警告に昇格させます。
> - &gt;= 1.8.0: このプロパティを削除します。

### kotlin.parallel.tasks.in.project Gradleプロパティを削除する

> **Issue**: [KT-46406](https://youtrack.jetbrains.com/issue/KT-46406)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `kotlin.parallel.tasks.in.project`プロパティを削除します。
>
> **Deprecation cycle**:
>
> - 1.5.20: 非推奨レベルを警告に昇格させます。
> - 1.6.20: このプロパティを削除します。

### kotlin.experimental.coroutines Gradle DSLオプションおよびkotlin.coroutines Gradleプロパティを非推奨にする

> **Issue**: [KT-50369](https://youtrack.jetbrains.com/issue/KT-50369)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `kotlin.experimental.coroutines` Gradle DSLオプションおよび`kotlin.coroutines`プロパティを非推奨にします。
>
> **Deprecation cycle**:
>
> - 1.6.20: 非推奨レベルを警告に昇格させます。
> - &gt;= 1.7.0: DSLオプションとプロパティを削除します。