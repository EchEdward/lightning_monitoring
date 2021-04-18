"""Define various geo utility functions."""
from math import radians, cos, sin, asin, sqrt, pi, radians, degrees
from _sph import direct, a_e



AVG_EARTH_RADIUS_METRIC = 6371
AVG_EARTH_RADIUS_IMPERIAL = 3958.8


def get_nearest_by_coordinates(
    data: list,
    target_latitude: float,
    target_longitude: float,
) -> list:
    """Get the closest dict entry based on latitude/longitude."""
    return min(data, key=lambda s: haversine(target_latitude, target_longitude, s[1], s[0]),)


def haversine(
    lat1: float, lon1: float, lat2: float, lon2: float, *, unit: str = "metric"
) -> float:
    """Determine the distance between two latitude/longitude pairs."""
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])

    # haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    calc_a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    calc_c = 2 * asin(sqrt(calc_a))

    if unit == "metric":
        return AVG_EARTH_RADIUS_METRIC * calc_c
    return AVG_EARTH_RADIUS_IMPERIAL * calc_c


def XYcord(kord):
    """ Переход от Геодезических координат 
    к плоским прямоугольным координатам """
    B = kord[0]/180*pi
    L = kord[1]
    n=int((6+L)/6)
    l=(L-(3+6*(n-1)))/57.29577951
    l2=l**2
    s2=(sin(B))**2
    s4=(sin(B))**4
    s6=(sin(B))**6


    x = 6367558.4968*B-sin(2*B)*(16002.8900+66.9607*s2+0.3515*s4-\
        l2*(1594561.25+5336.535*s2+26.790*s4+0.149*s6+\
        l2*(672483.4-811219.9*s2+5420.0*s4-10.6*s6+\
        l2*(278194-830174*s2+572434*s4-16010*s6+\
        l2*(109500-574700*s2+863700*s4-398600*s6)))))
    
    y = (5+10*n)*10**5+l*cos(B)*(6378245+21346.1415*s2+107.1590*s4+\
        0.5977*s6+l2*(1070204.16-2136826.66*s2+17.98*s4-11.99*s6+\
        l2*(270806-1523417*s2+1327645*s4-21701*s6+\
        l2*(79690-866190*s2+1730360*s4-945460*s6))))
    return (x,y)

def Distance(line):
    """ Расчёт растояния между двумя точками """
    return sqrt((line[1][0]-line[0][0])**2+(line[1][1]-line[0][1])**2)

def Lies(point,line):
    """ Проверка принадлежности точки отрезку """
    (x4,y4)=point
    [(x1,y1),(x2,y2)]=line
    e1=0.01

    if (abs(x4 - x1)<e1 and abs(y4 - y1)<e1) or (abs(x4 - x2)<e1 and abs(y4 - y2)<e1):
        return True
    else:
        if x1==x2==x4 and (y1<=y4<=y2 or y1>=y4>=y2):
            return True
        elif y1==y2==y4 and (x1<=x4<=x2 or x1>=x4>=x2):
            return True
        elif ((x1<=x4<=x2 or x1>=x4>=x2) and (y1<=y4<=y2 or y1>=y4>=y2)):
            return (x2-x1)/(x4-x1)-(y2-y1)/(y4-y1)<0.01
        else: return False
    

def Intersection(point,line):
    """ функция опускания перпендикуляра с точки на линию """
    (x,y)=point
    [(x1,y1),(x2,y2)]=line
    x4=((x2-x1)*(y2-y1)*(y-y1)+x1*pow(y2-y1, 2)+x*pow(x2-x1, 2))/(pow(y2-y1, 2)+pow(x2-x1, 2))
    y4=(y2-y1)*(x4-x1)/(x2-x1)+y1

    return Distance([(x,y),(x4,y4)]) if Lies((x4,y4),line) else float("inf")
    

def isnearby_vl(point,line,max_distanase=100):
    """ Проверяем рядом ли ударила молния """
    point = XYcord(point)
    line = [XYcord(line[0]), XYcord(line[1])]

    dist = min(Intersection(point,line),Distance([point,line[0]]),Distance([point,line[1]]))

    return dist if dist<=max_distanase else None

def isnearby_ps(point1,point2,max_distanase=200):
    """ Проверяем рядом ли ударила молния """
    dist = Distance([XYcord(point1),XYcord(point2)])

    return dist if dist<=max_distanase else None

def OnePoint(point, azi, dist):
    lat1 = radians(point[0])
    lon1 = radians(point[1])
    azi = radians(azi)
    dist = dist / a_e
    lat2, lon2 = direct(lat1, lon1, dist, azi)
    return (degrees(lat2),degrees(lon2))
