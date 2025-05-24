---
title: "Java annotation processing から KSP へのリファレンス"
---
## Program elements

| **Java** | **Closest facility in KSP** | **Notes** |
| -------- | --------------------------- | --------- |
| `AnnotationMirror` | `KSAnnotation` | |
| `AnnotationValue` | `KSValueArguments` | |
| `Element` | `KSDeclaration` / `KSDeclarationContainer` | |
| `ExecutableElement` | `KSFunctionDeclaration` | |
| `PackageElement` | `KSFile` | KSPはパッケージをプログラム要素としてモデル化しません |
| `Parameterizable` | `KSDeclaration` | |
| `QualifiedNameable` | `KSDeclaration` | |
| `TypeElement` | `KSClassDeclaration` | |
| `TypeParameterElement` | `KSTypeParameter` | |
| `VariableElement` | `KSValueParameter` / `KSPropertyDeclaration` | |

## Types

KSPでは明示的な型解決が必要なため、Javaの一部の機能は、解決前の`KSType`および対応する要素でのみ実行できます。

| **Java** | **Closest facility in KSP** | **Notes** |
| -------- | --------------------------- | --------- |
| `ArrayType` | `KSBuiltIns.arrayType` | |
| `DeclaredType` | `KSType` / `KSClassifierReference` | |
| `ErrorType` | `KSType.isError` | |
| `ExecutableType` | `KSType` / `KSCallableReference` | |
| `IntersectionType` | `KSType` / `KSTypeParameter` | |
| `NoType` | `KSType.isError` | KSPではN/A |
| `NullType` | | KSPではN/A |
| `PrimitiveType` | `KSBuiltIns` | Javaのプリミティブ型と完全に同じではありません |
| `ReferenceType` | `KSTypeReference` | |
| `TypeMirror` | `KSType` | |
| `TypeVariable` | `KSTypeParameter` | |
| `UnionType` | N/A | Kotlinのcatchブロックごとの型は1つだけです。`UnionType`は、Javaのアノテーションプロセッサでも観察できません |
| `WildcardType` | `KSType` / `KSTypeArgument` | |

## Misc

| **Java** | **Closest facility in KSP** | **Notes** |
| -------- | --------------------------- | --------- |
| `Name` | `KSName` | |
| `ElementKind` | `ClassKind` / `FunctionKind` | |
| `Modifier` | `Modifier` | |
| `NestingKind` | `ClassKind` / `FunctionKind` | |
| `AnnotationValueVisitor` |  | |
| `ElementVisitor` | `KSVisitor` | |
| `AnnotatedConstruct` | `KSAnnotated` | |
| `TypeVisitor` |  | |
| `TypeKind` | `KSBuiltIns` | 一部は組み込みで見つけることができます。それ以外の場合は、`DeclaredType`の`KSClassDeclaration`を確認してください |
| `ElementFilter` | `Collection.filterIsInstance` | |
| `ElementKindVisitor` | `KSVisitor` | |
| `ElementScanner` | `KSTopDownVisitor` | |
| `SimpleAnnotationValueVisitor` |  | KSPでは不要 |
| `SimpleElementVisitor` | `KSVisitor` | |
| `SimpleTypeVisitor` |  | |
| `TypeKindVisitor` |  | |
| `Types` | `Resolver` / `utils` | `utils`の一部は、シンボルインターフェースにも統合されています |
| `Elements` | `Resolver` / `utils` | |

## Details

Javaのアノテーション処理APIの機能をKSPでどのように実行できるかをご覧ください。

### AnnotationMirror

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `getAnnotationType` | `ksAnnotation.annotationType` |
| `getElementValues` | `ksAnnotation.arguments` |

### AnnotationValue

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `getValue` | `ksValueArgument.value` |

### Element

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `asType` | `ksClassDeclaration.asType(...)` は `KSClassDeclaration` に対してのみ使用可能です。型引数を指定する必要があります。 |
| `getAnnotation` | 実装予定 |
| `getAnnotationMirrors` | `ksDeclaration.annotations` |
| `getEnclosedElements` | `ksDeclarationContainer.declarations` |
| `getEnclosingElements` | `ksDeclaration.parentDeclaration` |
| `getKind` | 型チェックを行い、`ClassKind` または `FunctionKind` に従ってキャストします |
| `getModifiers` | `ksDeclaration.modifiers` |
| `getSimpleName` | `ksDeclaration.simpleName` |

### ExecutableElement

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `getDefaultValue` | 実装予定 |
| `getParameters` | `ksFunctionDeclaration.parameters` |
| `getReceiverType` | `ksFunctionDeclaration.parentDeclaration` |
| `getReturnType` | `ksFunctionDeclaration.returnType` |
| `getSimpleName` | `ksFunctionDeclaration.simpleName` |
| `getThrownTypes` | Kotlinでは不要 |
| `getTypeParameters` | `ksFunctionDeclaration.typeParameters` |
| `isDefault` | 親の宣言がインターフェースであるかどうかを確認します |
| `isVarArgs` | `ksFunctionDeclaration.parameters.any { it.isVarArg }` |

### Parameterizable

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `getTypeParameters` | `ksFunctionDeclaration.typeParameters` |

### QualifiedNameable

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `getQualifiedName` | `ksDeclaration.qualifiedName` |

### TypeElement
<table>
<tr>
<td>
<b>Java</b>
</td>
<td>
<b>KSP equivalent</b>
</td>
</tr>
<tr>
<td>
`getEnclosedElements`
</td>
<td>
`ksClassDeclaration.declarations`
</td>
</tr>
<tr>
<td>
`getEnclosingElement`
</td>
<td>
`ksClassDeclaration.parentDeclaration`
</td>
</tr>
<tr>
<td>
`getInterfaces`
</td>
<td>

```kotlin
// Should be able to do without resolution
ksClassDeclaration.superTypes
    .map { it.resolve() }
    .filter { (it?.declaration as? KSClassDeclaration)?.classKind == ClassKind.INTERFACE }
```
</td>
</tr>
<tr>
<td>
`getNestingKind`
</td>
<td>
`KSClassDeclaration.parentDeclaration` と `inner` 修飾子を確認してください
</td>
</tr>
<tr>
<td>
`getQualifiedName`
</td>
<td>
`ksClassDeclaration.qualifiedName`
</td>
</tr>
<tr>
<td>
`getSimpleName`
</td>
<td>
`ksClassDeclaration.simpleName`
</td>
</tr>
<tr>
<td>
`getSuperclass`
</td>
<td>

```kotlin
// Should be able to do without resolution
ksClassDeclaration.superTypes
    .map { it.resolve() }
    .filter { (it?.declaration as? KSClassDeclaration)?.classKind == ClassKind.CLASS }
```
</td>
</tr>
<tr>
<td>
`getTypeParameters`
</td>
<td>
`ksClassDeclaration.typeParameters`
</td>
</tr>
</table>

### TypeParameterElement

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `getBounds` | `ksTypeParameter.bounds` |
| `getEnclosingElement` | `ksTypeParameter.parentDeclaration` |
| `getGenericElement` | `ksTypeParameter.parentDeclaration` |

### VariableElement

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `getConstantValue` | 実装予定 |
| `getEnclosingElement` | `ksValueParameter.parentDeclaration` |
| `getSimpleName` | `ksValueParameter.simpleName` |

### ArrayType

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `getComponentType` | `ksType.arguments.first()` |

### DeclaredType

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `asElement` | `ksType.declaration` |
| `getEnclosingType` | `ksType.declaration.parentDeclaration` |
| `getTypeArguments` | `ksType.arguments` |

### ExecutableType

:::note
関数の `KSType` は、`FunctionN<R, T1, T2, ..., TN>` ファミリで表されるシグネチャにすぎません。

:::

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `getParameterTypes` | `ksType.declaration.typeParameters`, `ksFunctionDeclaration.parameters.map { it.type }` |
| `getReceiverType` | `ksFunctionDeclaration.parentDeclaration.asType(...)` |
| `getReturnType` | `ksType.declaration.typeParameters.last()` |
| `getThrownTypes` | Kotlinでは不要 |
| `getTypeVariables` | `ksFunctionDeclaration.typeParameters` |

### IntersectionType

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `getBounds` | `ksTypeParameter.bounds` |

### TypeMirror

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `getKind` | プリミティブ型、`Unit` 型の場合は `KSBuiltIns` の型と比較し、それ以外の場合は宣言された型と比較します |

### TypeVariable

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `asElement` | `ksType.declaration` |
| `getLowerBound` | 決定予定。キャプチャが提供され、明示的な境界チェックが必要な場合にのみ必要です。 |
| `getUpperBound` | `ksTypeParameter.bounds` |

### WildcardType
<table>
<tr>
<td>
<b>Java</b>
</td>
<td>
<b>KSP equivalent</b>
</td>
</tr>
<tr>
<td>
`getExtendsBound`
</td>
<td>

```kotlin
if (ksTypeArgument.variance == Variance.COVARIANT) ksTypeArgument.type else null
```
</td>
</tr>
<tr>
<td>
`getSuperBound`
</td>
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
<td>
<b>Java</b>
</td>
<td>
<b>KSP equivalent</b>
</td>
</tr>
<tr>
<td>
`getAllAnnotationMirrors`
</td>
<td>
`KSDeclarations.annotations`
</td>
</tr>
<tr>
<td>
`getAllMembers`
</td>
<td>
`getAllFunctions`、`getAllProperties` は実装予定
</td>
</tr>
<tr>
<td>
`getBinaryName`
</td>
<td>
決定予定、<a href="https://docs.oracle.com/javase/specs/jls/se13/html/jls-13.html#jls-13.1">Java Specification</a>を参照してください
</td>
</tr>
<tr>
<td>
`getConstantExpression`
</td>
<td>
式ではなく定数値があります
</td>
</tr>
<tr>
<td>
`getDocComment`
</td>
<td>
実装予定
</td>
</tr>
<tr>
<td>
`getElementValuesWithDefaults`
</td>
<td>
実装予定
</td>
</tr>
<tr>
<td>
`getName`
</td>
<td>
`resolver.getKSNameFromString`
</td>
</tr>
<tr>
<td>
`getPackageElement`
</td>
<td>
パッケージはサポートされていませんが、パッケージ情報を取得できます。KSPではパッケージの操作はできません
</td>
</tr>
<tr>
<td>
`getPackageOf`
</td>
<td>
パッケージはサポートされていません
</td>
</tr>
<tr>
<td>
`getTypeElement`
</td>
<td>
`Resolver.getClassDeclarationByName`
</td>
</tr>
<tr>
<td>
`hides`
</td>
<td>
実装予定
</td>
</tr>
<tr>
<td>
`isDeprecated`
</td>
<td>

```kotlin
KsDeclaration.annotations.any { 
    it.annotationType.resolve()!!.declaration.qualifiedName!!.asString() == Deprecated::class.qualifiedName
}
```
</td>
</tr>
<tr>
<td>
`overrides`
</td>
<td>
`KSFunctionDeclaration.overrides` / `KSPropertyDeclaration.overrides` (それぞれのクラスのメンバー関数)
</td>
</tr>
<tr>
<td>
`printElements`
</td>
<td>
KSPには、ほとんどのクラスに基本的な`toString()`実装があります
</td>
</tr>
</table>

### Types

| **Java** | **KSP equivalent** |
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
| `getNullType` | コンテキストによっては、`KSType.markNullable` が役立つ場合があります |
| `getPrimitiveType` | 不要、`KSBuiltins` を確認してください |
| `getWildcardType` | `KSTypeArgument` を予期する場所に `Variance` を使用します |
| `isAssignable` | `ksType.isAssignableFrom` |
| `isSameType` | `ksType.equals` |
| `isSubsignature` | `functionTypeA == functionTypeB` / `functionTypeA == functionTypeB.starProjection()` |
| `isSubtype` | `ksType.isAssignableFrom` |
| `unboxedType` | 不要 |