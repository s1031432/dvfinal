import pandas as pd
col = ['class','name','Birthday','salary','height','weight']
data = [['class0', 'John', '1993-10-01',36000, 177, 76], ['class0', 'Bob', '1992-10-02',52000, 173, 68], ['class1', 'Helen', '1990-10-01',43000, 167, 55], ['class2', 'Alice', '1983-10-03', 27000, 169, 56], ['class1', 'Justin', '1991-10-02',22000, 180, 78], ['class0', 'David', '2001-10-03', 15000, 170, 69]]
per_df = pd.DataFrame(data,columns=col, index=[1,2,3,4,5,6])
A=per_df['salary']
A.sort()
print(A)

print(per_df.at['2','Birthday'])  
print(per_df.iat[1,4])