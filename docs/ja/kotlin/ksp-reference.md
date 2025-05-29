[//]: # (title: Javaのアノテーション処理からKSPへのリファレンス)

## プログラム要素

| **Java** | **KSPにおける最も近い機能** | **備考** |
| -------- | --------------------------- | --------- |
| `AnnotationMirror` | `KSAnnotation` | |
| `AnnotationValue` | `KSValueArguments` | |
| `Element` | `KSDeclaration` / `KSDeclarationContainer` | |
| `ExecutableElement` | `KSFunctionDeclaration` | |
| `PackageElement` | `KSFile` | KSPはパッケージをプログラム要素としてモデル化しない |
| `Parameterizable` | `KSDeclaration` | |
| `QualifiedNameable` | `KSDeclaration` | |
| `TypeElement` | `KSClassDeclaration` | |
| `TypeParameterElement` | `KSTypeParameter` | |
| `VariableElement` | `KSValueParameter` / `KSPropertyDeclaration` | |

## 型

KSPは明示的な型解決を必要とするため、Javaの一部の機能は`KSType`と、解決前の対応する要素によってのみ実行できます。

| **Java** | **KSPにおける最も近い機能** | **備考** |
| -------- | --------------------------- | --------- |
| `ArrayType` | `KSBuiltIns.arrayType` | |
| `DeclaredType` | `KSType` / `KSClassifierReference` | |
| `ErrorType` | `KSType.isError` | |
| `ExecutableType` | `KSType` / `KSCallableReference` | |
| `IntersectionType` | `KSType` / `KSTypeParameter` | |
| `NoType` | `KSType.isError` | KSPには存在しない |
| `NullType` | | KSPには存在しない |
| `PrimitiveType` | `KSBuiltIns` | Javaのプリミティブ型とは完全に同じではない |
| `ReferenceType` | `KSTypeReference` | |
| `TypeMirror` | `KSType` | |
| `TypeVariable` | `KSTypeParameter` | |
| `UnionType` | N/A | Kotlinはcatchブロックごとに1つの型しか持ちません。`UnionType`はJavaのアノテーションプロセッサでも観測できません。 |
| `WildcardType` | `KSType` / `KSTypeArgument` | |

## その他

| **Java** | **KSPにおける最も近い機能** | **備考** |
| -------- | --------------------------- | --------- |
| `Name` | `KSName` | |
| `ElementKind` | `ClassKind` / `FunctionKind` | |
| `Modifier` | `Modifier` | |
| `NestingKind` | `ClassKind` / `FunctionKind` | |
| `AnnotationValueVisitor` | | |
| `ElementVisitor` | `KSVisitor` | |
| `AnnotatedConstruct` | `KSAnnotated` | |
| `TypeVisitor` | | |
| `TypeKind` | `KSBuiltIns` | いくつかは組み込み型で見つけられます。それ以外は`DeclaredType`のために`KSClassDeclaration`を確認してください。 |
| `ElementFilter` | `Collection.filterIsInstance` | |
| `ElementKindVisitor` | `KSVisitor` | |
| `ElementScanner` | `KSTopDownVisitor` | |
| `SimpleAnnotationValueVisitor` | | KSPでは不要 |
| `SimpleElementVisitor` | `KSVisitor` | |
| `SimpleTypeVisitor` | | |
| `TypeKindVisitor` | | |
| `Types` | `Resolver` / `utils` | `utils`の一部はシンボルインターフェースにも統合されています。 |
| `Elements` | `Resolver` / `utils` | |

## 詳細

Javaのアノテーション処理APIの機能がKSPによってどのように実行できるかをご覧ください。

### AnnotationMirror

| **Java** | **KSPでの同等なもの** |
| -------- | ------------------ |
| `getAnnotationType` | `ksAnnotation.annotationType` |
| `getElementValues` | `ksAnnotation.arguments` |

### AnnotationValue

| **Java** | **KSPでの同等なもの** |
| -------- | ------------------ |
| `getValue` | `ksValueArgument.value` |

### Element

| **Java** | **KSPでの同等なもの** |
| -------- | ------------------ |
| `asType` | `ksClassDeclaration.asType(...)`は`KSClassDeclaration`でのみ利用可能です。型引数を指定する必要があります。 |
| `getAnnotation` | 実装予定 |
| `getAnnotationMirrors` | `ksDeclaration.annotations` |
| `getEnclosedElements` | `ksDeclarationContainer.declarations` |
| `getEnclosingElements` | `ksDeclaration.parentDeclaration` |
| `getKind` | `ClassKind`または`FunctionKind`に従った型チェックとキャスト |
| `getModifiers` | `ksDeclaration.modifiers` |
| `getSimpleName` | `ksDeclaration.simpleName` |

### ExecutableElement

| **Java** | **KSPでの同等なもの** |
| -------- | ------------------ |
| `getDefaultValue` | 実装予定 |
| `getParameters` | `ksFunctionDeclaration.parameters` |
| `getReceiverType` | `ksFunctionDeclaration.parentDeclaration` |
| `getReturnType` | `ksFunctionDeclaration.returnType` |
| `getSimpleName` | `ksFunctionDeclaration.simpleName` |
| `getThrownTypes` | Kotlinでは不要 |
| `getTypeParameters` | `ksFunctionDeclaration.typeParameters` |
| `isDefault` | 親の宣言がインターフェースであるかどうかを確認 |
| `isVarArgs` | `ksFunctionDeclaration.parameters.any { it.isVarArg }` |

### Parameterizable

| **Java** | **KSPでの同等なもの** |
| -------- | ------------------ |
| `getTypeParameters` | `ksFunctionDeclaration.typeParameters` |

### QualifiedNameable

| **Java** | **KSPでの同等なもの** |
| -------- | ------------------ |
| `getQualifiedName` | `ksDeclaration.qualifiedName` |

### TypeElement

<table>
    <tr>
        <td><b>Java</b></td>
        <td><b>KSPでの同等なもの</b></td>
    </tr>
    <tr>
        <td><code>getEnclosedElements</code></td>
        <td><code>ksClassDeclaration.declarations</code></td>
    </tr>
    <tr>
        <td><code>getEnclosingElement</code></td>
        <td><code>ksClassDeclaration.parentDeclaration</code></td>
    </tr>
    <tr>
        <td><code>getInterfaces</code></td>
<td>

```kotlin
// 解決なしで実行できるはず
ksClassDeclaration.superTypes
    .map { it.resolve() }
    .filter { (it?.declaration as? KSClassDeclaration)?.classKind == ClassKind.INTERFACE }
```

</td>
    </tr>
    <tr>
        <td><code>getNestingKind</code></td>
        <td><code>KSClassDeclaration.parentDeclaration</code>と<code>inner</code>修飾子を確認</td>
    </tr>
    <tr>
        <td><code>getQualifiedName</code></td>
        <td><code>ksClassDeclaration.qualifiedName</code></td>
    </tr>
    <tr>
        <td><code>getSimpleName</code></td>
        <td><code>ksClassDeclaration.simpleName</code></td>
    </tr>
    <tr>
        <td><code>getSuperclass</code></td>
<td>

```kotlin
// 解決なしで実行できるはず
ksClassDeclaration.superTypes
    .map { it.resolve() }
    .filter { (it?.declaration as? KSClassDeclaration)?.classKind == ClassKind.CLASS }
```

</td>
    </tr>
    <tr>
        <td><code>getTypeParameters</code></td>
        <td><code>ksClassDeclaration.typeParameters</code></td>
    </tr>
</table>

### TypeParameterElement

| **Java** | **KSPでの同等なもの** |
| -------- | ------------------ |
| `getBounds` | `ksTypeParameter.bounds` |
| `getEnclosingElement` | `ksTypeParameter.parentDeclaration` |
| `getGenericElement` | `ksTypeParameter.parentDeclaration` |

### VariableElement

| **Java** | **KSPでの同等なもの** |
| -------- | ------------------ |
| `getConstantValue` | 実装予定 |
| `getEnclosingElement` | `ksValueParameter.parentDeclaration` |
| `getSimpleName` | `ksValueParameter.simpleName` |

### ArrayType

| **Java** | **KSPでの同等なもの** |
| -------- | ------------------ |
| `getComponentType` | `ksType.arguments.first()` |

### DeclaredType

| **Java** | **KSPでの同等なもの** |
| -------- | ------------------ |
| `asElement` | `ksType.declaration` |
| `getEnclosingType` | `ksType.declaration.parentDeclaration` |
| `getTypeArguments` | `ksType.arguments` |

### ExecutableType

> 関数の`KSType`は、`FunctionN<R, T1, T2, ..., TN>`ファミリーで表現される単なるシグネチャです。
>
{style="note"}

| **Java** | **KSPでの同等なもの** |
| -------- | ------------------ |
| `getParameterTypes` | `ksType.declaration.typeParameters`, `ksFunctionDeclaration.parameters.map { it.type }` |
| `getReceiverType` | `ksFunctionDeclaration.parentDeclaration.asType(...)` |
| `getReturnType` | `ksType.declaration.typeParameters.last()` |
| `getThrownTypes` | Kotlinでは不要 |
| `getTypeVariables` | `ksFunctionDeclaration.typeParameters` |

### IntersectionType

| **Java** | **KSPでの同等なもの** |
| -------- | ------------------ |
| `getBounds` | `ksTypeParameter.bounds` |

### TypeMirror

| **Java** | **KSPでの同等なもの** |
| -------- | ------------------ |
| `getKind` | プリミティブ型、`Unit`型のために`KSBuiltIns`内の型と比較し、それ以外の場合は宣言された型として確認する |

### TypeVariable

| **Java** | **KSPでの同等なもの** |
| -------- | ------------------ |
| `asElement` | `ksType.declaration` |
| `getLowerBound` | 決定予定。キャプチャが提供され、明示的な境界チェックが必要な場合にのみ必要。 |
| `getUpperBound` | `ksTypeParameter.bounds` |

### WildcardType

<table>
    <tr>
        <td><b>Java</b></td>
        <td><b>KSPでの同等なもの</b></td>
    </tr>
    <tr>
        <td><code>getExtendsBound</code></td>
<td>

```kotlin
if (ksTypeArgument.variance == Variance.COVARIANT) ksTypeArgument.type else null
```

</td>
    </tr>
    <tr>
        <td><code>getSuperBound</code></td>
<td>

```kotlin
if (ksTypeArgument.variance == Variance.CONTRAVARIANT) ksTypeArgument.type else null
```

</td>
    </tr>
</table>

### Elements

<table>
    <tr>
        <td><b>Java</b></td>
        <td><b>KSPでの同等なもの</b></td>
    </tr>
    <tr>
        <td><code>getAllAnnotationMirrors</code></td>
        <td><code>KSDeclarations.annotations</code></td>
    </tr>
    <tr>
        <td><code>getAllMembers</code></td>
        <td><code>getAllFunctions</code>、<code>getAllProperties</code>は実装予定</td>
    </tr>
    <tr>
        <td><code>getBinaryName</code></td>
        <td>決定予定。<a href="https://docs.oracle.com/javase/specs/jls/se13/html/jls-13.html#jls-13.1">Java Specification</a>を参照</td>
    </tr>
    <tr>
        <td><code>getConstantExpression</code></td>
        <td>定数値はありますが、式ではありません</td>
    </tr>
    <tr>
        <td><code>getDocComment</code></td>
        <td>実装予定</td>
    </tr>
    <tr>
        <td><code>getElementValuesWithDefaults</code></td>
        <td>実装予定</td>
    </tr>
    <tr>
        <td><code>getName</code></td>
        <td><code>resolver.getKSNameFromString</code></td>
    </tr>
    <tr>
        <td><code>getPackageElement</code></td>
        <td>パッケージはサポートされていませんが、パッケージ情報は取得できます。KSPではパッケージに対する操作はできません。</td>
    </tr>
    <tr>
        <td><code>getPackageOf</code></td>
        <td>パッケージはサポートされていません</td>
    </tr>
    <tr>
        <td><code>getTypeElement</code></td>
        <td><code>Resolver.getClassDeclarationByName</code></td>
    </tr>
    <tr>
        <td><code>hides</code></td>
        <td>実装予定</td>
    </tr>
    <tr>
        <td><code>isDeprecated</code></td>
<td>

```kotlin
KsDeclaration.annotations.any { 
    it.annotationType.resolve()!!.declaration.qualifiedName!!.asString() == Deprecated::class.qualifiedName
}
```

</td>
    </tr>
    <tr>
        <td><code>overrides</code></td>
        <td><code>KSFunctionDeclaration.overrides</code> / <code>KSPropertyDeclaration.overrides</code>（それぞれのクラスのメンバー関数）</td>
    </tr>
    <tr>
        <td><code>printElements</code></td>
        <td>KSPはほとんどのクラスで基本的な<code>toString()</code>実装を持っています</td>
    </tr>
</table>

### Types
{id="type-operations"}

| **Java** | **KSPでの同等なもの** |
| -------- | ------------------ |
| `asElement` | `ksType.declaration` |
| `asMemberOf` | `resolver.asMemberOf` |
| `boxedClass` | 不要 |
| `capture` | 決定予定 |
| `contains` | `KSType.isAssignableFrom` |
| `directSuperTypes` | `(ksType.declaration as KSClassDeclaration).superTypes` |
| `erasure` | `ksType.starProjection()` |
| `getArrayType` | `ksBuiltIns.arrayType.replace(...)` |
| `getDeclaredType` | `ksClassDeclaration.asType` |
| `getNoType` | `ksBuiltIns.nothingType` / `null` |
| `getNullType` | コンテキストに応じて、`KSType.markNullable`が役立つことがあります |
| `getPrimitiveType` | 不要、`KSBuiltins`を確認 |
| `getWildcardType` | `KSTypeArgument`を期待する場所で`Variance`を使用 |
| `isAssignable` | `ksType.isAssignableFrom` |
| `isSameType` | `ksType.equals` |
| `isSubsignature` | `functionTypeA == functionTypeB` / `functionTypeA == functionTypeB.starProjection()` |
| `isSubtype` | `ksType.isAssignableFrom` |
| `unboxedType` | 不要 |